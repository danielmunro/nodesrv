import {AffectType} from "../affect/affectType"
import {Affect} from "../affect/model/affect"
import {Disposition} from "../mob/enum/disposition"
import {Fight} from "../mob/fight/fight"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {AuthorizationLevel, isSpecialAuthorizationLevel} from "../player/authorizationLevel"
import {Request} from "../request/request"
import {ConditionMessages as SkillMessages} from "../skill/constants"
import {SkillType} from "../skill/skillType"
import {SpellType} from "../spell/spellType"
import Maybe from "../support/functional/maybe"
import collectionSearch from "../support/matcher/collectionSearch"
import {format} from "../support/string"
import Check from "./check"
import CheckComponent from "./checkComponent"
import CheckResult from "./checkResult"
import {CheckType} from "./checkType"
import {Messages} from "./constants"
import Cost from "./cost/cost"
import {CostType} from "./cost/costType"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private checkResults: CheckResult[] = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private mob: Mob
  private captured: any

  constructor(private readonly mobService: MobService, private readonly request: Request) {
    this.mob = request.mob
  }

  public requireMob(failMessage = Messages.NoMob): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      collectionSearch(this.mobService.mobTable.getMobs(), this.request.getSubject()),
      failMessage))

    return this
  }

  public requireMerchant() {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      this.mobService.findMobInRoomWithMob(this.request.mob, (m: Mob) => m.isMerchant()),
      Messages.NoMerchant,
    ))

    return this
  }

  public optionalMob(mob: Mob) {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob))

    return this
  }

  public requirePlayer(mob: Mob, failMessage = Messages.NotAPlayer): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.IsPlayer,
      new Maybe(mob).do((m: Mob) => !m.traits.isNpc).or(() => false).get(),
      failMessage))

    return this
  }

  public requireSpecialAuthorization(
    authorizationLevel: AuthorizationLevel, failMessage = Messages.NotAuthorized) {
    this.checks.push(this.newCheckComponent(
      CheckType.AuthorizationLevel,
      isSpecialAuthorizationLevel(authorizationLevel),
      failMessage))

    return this
  }

  public requireImmortal(
    authorizationLevel: AuthorizationLevel, failMessage = Messages.NotAuthorized) {
    this.checks.push(this.newCheckComponent(
      CheckType.AuthorizationLevel,
      authorizationLevel === AuthorizationLevel.Immortal,
      failMessage))

    return this
  }

  public requireSubject(failMessage?: string) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasArguments,
      this.request.getSubject(),
      failMessage))

    return this
  }

  public require(thing: any, failMessage: string, checkType: CheckType = CheckType.Unspecified) {
    this.checks.push(this.newCheckComponent(checkType, thing, failMessage))

    return this
  }

  public capture(toCapture?: any) {
    this.checks.push(this.newCheckComponent(CheckType.Unspecified, (thing: any) =>
      this.captured = toCapture || thing))

    return this
  }

  public not() {
    this.confirm = false
    return this
  }

  public addCost(cost: Cost) {
    this.costs.push(cost)
    return this
  }

  public addManaCost(amount: number) {
    this.costs.push(new Cost(CostType.Mana, amount, SkillMessages.All.NotEnoughMana))
    return this
  }

  public forMob(mob: Mob) {
    this.mob = mob
    return this
  }

  public atLevelOrGreater(level: number) {
    this.checks.push(this.newCheckComponent(
      CheckType.Level,
      this.mob.level >= level,
      SkillMessages.All.NotEnoughExperience))
    return this
  }

  public requireSkill(skillType: SkillType) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasSkill,
      this.mob.skills.find(s => s.skillType === skillType),
      SkillMessages.All.NoSkill))
    return this
  }

  public requireSpell(spellType: SpellType) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasSpell,
      this.mob.spells.find(s => s.spellType === spellType),
      SkillMessages.All.NoSpell))
    return this
  }

  public requireAffect(affectType: AffectType, failMessage: string) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasAffect,
      (captured: any) => captured.affects.find((a: Affect) => a.affectType === affectType),
      failMessage))
    return this
  }

  public requireDisposition(disposition: Disposition, failMessage: string) {
    if (disposition === Disposition.Any) {
      this.not()
      disposition = Disposition.Dead
    }
    this.checks.push(
      this.newCheckComponent(CheckType.Disposition, this.mob.disposition === disposition, failMessage))
    return this
  }

  public requireFight(failMessage: string = SkillMessages.All.NoTarget) {
    this.checks.push(this.newCheckComponent(
      CheckType.IsFighting,
      new Maybe(this.mobService.findFight((f: Fight) => f.isParticipant(this.mob)))
        .do((f: Fight) => f.getOpponentFor(this.mob) as Mob)
        .or(() => false)
        .get(),
      failMessage))
    return this
  }

  public async create(): Promise<Check> {
    this.checkResults = []

    const checkFail = await this.findCheckFailure()
    if (checkFail) {
      return checkFail
    }

    const costFail = await this.findCostFail()
    if (costFail) {
      return costFail
    }

    return Check.ok(this.captured, this.checkResults, this.costs)
  }

  private async findCostFail(): Promise<Check | void> {
    const costFail = this.costs.find(cost => !cost.canApplyTo(this.mob))
    if (costFail) {
      return Check.fail(costFail.failMessage, this.checkResults, this.costs)
    }
  }

  private async findCheckFailure(): Promise<Check | void> {
    let lastThing: any

    const checkFail = this.checks.find(checkComponent => {
      const checkResult = checkComponent.getThing(this.captured ? this.captured : lastThing, lastThing)
      this.checkResults.push(new CheckResult(checkComponent.checkType, checkResult))
      lastThing = checkResult
      return !checkResult && checkComponent.isRequired
    })
    if (checkFail) {
      return Check.fail(this.getFailMessage(checkFail.failMessage), this.checkResults, this.costs)
    }
  }

  private getFailMessage(failMessage: any) {
    return typeof(failMessage) === "function" ? format(failMessage(), this.captured) : failMessage
  }

  private newCheckComponent(checkType: CheckType, thing: any, failMessage?: string): CheckComponent {
    const component = new CheckComponent(checkType, this.confirm, thing, failMessage)
    this.confirm = true
    return component
  }
}

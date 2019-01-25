import {MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_NOT_AUTHORIZED, MESSAGE_FAIL_NOT_PLAYER} from "../action/constants"
import {AffectType} from "../affect/affectType"
import {Disposition} from "../mob/enum/disposition"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {AuthorizationLevel, isSpecialAuthorizationLevel} from "../player/authorizationLevel"
import {Request} from "../request/request"
import {Messages as SkillMessages} from "../skill/precondition/constants"
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
  private checkResults = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private mob: Mob
  private captured: any

  constructor(private readonly mobService: MobService, private readonly request: Request) {
    this.mob = request.mob
  }

  public requireMob(failMessage = MESSAGE_FAIL_NO_TARGET): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      collectionSearch(this.mobService.mobTable.getMobs(), this.request.getSubject()),
      failMessage))

    return this
  }

  public requireMerchant() {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      this.mobService.findMobInRoomWithMob(this.request.mob, m => m.isMerchant()),
      Messages.NoMerchant,
    ))

    return this
  }

  public optionalMob(mob: Mob) {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob))

    return this
  }

  public requirePlayer(mob: Mob, failMessage = MESSAGE_FAIL_NOT_PLAYER): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.IsPlayer,
      new Maybe(mob).do(m => !m.traits.isNpc).or(() => false).get(),
      failMessage))

    return this
  }

  public requireSpecialAuthorization(
    authorizationLevel: AuthorizationLevel, failMessage = MESSAGE_FAIL_NOT_AUTHORIZED) {
    this.checks.push(this.newCheckComponent(
      CheckType.AuthorizationLevel,
      isSpecialAuthorizationLevel(authorizationLevel),
      failMessage))

    return this
  }

  public requireImmortal(
    authorizationLevel: AuthorizationLevel, failMessage = MESSAGE_FAIL_NOT_AUTHORIZED) {
    this.checks.push(this.newCheckComponent(
      CheckType.AuthorizationLevel,
      authorizationLevel === AuthorizationLevel.Immortal,
      failMessage))

    return this
  }

  public requireSubject(failMessage: string = null) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasArguments,
      this.request.getSubject(),
      failMessage))

    return this
  }

  public require(thing, failMessage, checkType: CheckType = CheckType.Unspecified) {
    this.checks.push(this.newCheckComponent(checkType, thing, failMessage))

    return this
  }

  public capture(toCapture = null) {
    this.checks.push(this.newCheckComponent(CheckType.Unspecified, thing =>
      this.captured = toCapture ? toCapture : thing))

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

  public requireAffect(affectType: AffectType, failMessage) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasAffect,
      captured => captured.affects.find(a => a.affectType === affectType),
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
      new Maybe(this.mobService.findFight(f => f.isParticipant(this.mob)))
        .do(f => f.getOpponentFor(this.mob))
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

  private async findCostFail() {
    const costFail = this.costs.find(cost => !cost.canApplyTo(this.mob))
    if (costFail) {
      return Check.fail(costFail.failMessage, this.checkResults, this.costs)
    }
  }

  private async findCheckFailure() {
    let lastThing

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

  private getFailMessage(failMessage) {
    return typeof(failMessage) === "function" ? format(failMessage(), this.captured) : failMessage
  }

  private newCheckComponent(checkType: CheckType, thing, failMessage = null): CheckComponent {
    const component = new CheckComponent(checkType, this.confirm, thing, failMessage)
    this.confirm = true
    return component
  }
}

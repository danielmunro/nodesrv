import {ActionPart} from "../action/enum/actionPart"
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
import ActionPartCheck from "./actionPartCheck"
import Check from "./check"
import CheckComponent from "./checkComponent"
import CheckResult from "./checkResult"
import {CheckType} from "./checkType"
import {CheckMessages} from "./constants"
import Cost from "./cost/cost"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private checkResults: CheckResult[] = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private mob: Mob
  private captured: any
  private lastCheckResult: CheckResult

  constructor(
    private readonly mobService: MobService,
    private readonly request: Request,
    private readonly actionPartChecks: ActionPartCheck[]) {
    this.mob = request.mob
  }

  public requireFromActionParts(request: Request, actionParts: ActionPart[]): CheckBuilder {
    actionParts.map(actionPart => this.actionPartChecks.find(a => a.getActionPart() === actionPart))
      .filter(Boolean)
      .forEach(actionPartCheck => actionPartCheck.addToCheckBuilder(this, request, actionParts))
    return this
  }

  public requireMob(failMessage = CheckMessages.NoMob): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      collectionSearch(this.mobService.mobTable.getMobs(), this.request.getSubject()),
      failMessage))

    return this
  }

  public requireMobInRoom(failMessage = CheckMessages.NoMob): CheckBuilder {
    const lastArg = this.request.getLastArg()
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      this.mobService.findMobInRoomWithMob(this.mob, mob => mob.name.startsWith(lastArg)),
      failMessage))

    return this
  }

  public requireMerchant() {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      this.mobService.findMobInRoomWithMob(this.mob, (m: Mob) => m.isMerchant()),
      CheckMessages.NoMerchant,
    ))

    return this
  }

  public optionalMob(mob?: Mob) {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob))

    return this
  }

  public requirePlayer(mob: Mob, failMessage = CheckMessages.NotAPlayer): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.IsPlayer,
      new Maybe(mob).do((m: Mob) => !m.traits.isNpc ? m : null).or(() => false).get(),
      failMessage))

    return this
  }

  public requireSpecialAuthorization(
    authorizationLevel: AuthorizationLevel, failMessage = CheckMessages.NotAuthorized) {
    this.checks.push(this.newCheckComponent(
      CheckType.AuthorizationLevel,
      isSpecialAuthorizationLevel(authorizationLevel),
      failMessage))

    return this
  }

  public requireImmortal(
    authorizationLevel: AuthorizationLevel, failMessage = CheckMessages.NotAuthorized) {
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

  public requireTarget(thing: any, failMessage: string) {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, thing, failMessage))

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

  public addCheck(checkComponent: CheckComponent): void {
    this.checks.push(checkComponent)
  }

  public async create(): Promise<Check> {
    this.checkResults = []

    const checkFail = this.findCheckFailure()
    if (checkFail) {
      return checkFail
    }

    const costFail = this.findCostFail()
    if (costFail) {
      return costFail
    }

    return Check.ok(this.captured, this.checkResults, this.costs)
  }

  private findCostFail(): Check | void {
    return new Maybe(this.costs.find(cost => !cost.canApplyTo(this.mob)))
      .do(costFail => Check.fail(costFail.failMessage, this.checkResults, this.costs))
      .get()
  }

  private findCheckFailure(): Check | void {
    return new Maybe(this.checks.find(checkComponent => this.testCheckComponent(checkComponent)))
      .do(checkFail => Check.fail(this.getFailMessage(checkFail.failMessage), this.checkResults, this.costs))
      .get()
  }

  private testCheckComponent(checkComponent: CheckComponent) {
    const checkResult = checkComponent.getThing(this.captured, this.lastCheckResult)
    this.checkResults.push(new CheckResult(checkComponent.checkType, checkResult))
    this.lastCheckResult = checkResult
    return !checkResult && checkComponent.isRequired
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

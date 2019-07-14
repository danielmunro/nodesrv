import {ActionPart} from "../../action/enum/actionPart"
import {AffectEntity} from "../../affect/entity/affectEntity"
import {AffectType} from "../../affect/enum/affectType"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Disposition} from "../../mob/enum/disposition"
import {Fight} from "../../mob/fight/fight"
import MobService from "../../mob/service/mobService"
import {ConditionMessages as SkillMessages} from "../../mob/skill/constants"
import {SkillType} from "../../mob/skill/skillType"
import {SpellType} from "../../mob/spell/spellType"
import {isSpecialAuthorizationLevel} from "../../player/authorizationLevels"
import {AuthorizationLevel} from "../../player/enum/authorizationLevel"
import Request from "../../request/request"
import Maybe from "../../support/functional/maybe/maybe"
import collectionSearch from "../../support/matcher/collectionSearch"
import match from "../../support/matcher/match"
import {format} from "../../support/string"
import ActionPartCheck from "../actionPartCheck/actionPartCheck"
import Check from "../check"
import CheckResult from "../checkResult"
import {CheckMessages} from "../constants"
import Cost from "../cost/cost"
import {CheckType} from "../enum/checkType"
import CheckComponent from "./checkComponent"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private checkResults: CheckResult[] = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private mob: MobEntity
  private captured: any
  private lastCheckResult: CheckResult

  constructor(
    private readonly mobService: MobService,
    private readonly request: Request,
    private readonly actionPartChecks: ActionPartCheck[]) {
    this.mob = request.mob
  }

  public requireFromActionParts(request: Request, actionParts: ActionPart[]): CheckBuilder {
    const parts = actionParts.map(actionPart =>
      this.actionPartChecks.find(a => a.getActionPart() === actionPart))
        .filter(Boolean) as ActionPartCheck[]
    parts.forEach(actionPartCheck =>
      actionPartCheck.addToCheckBuilder(this, request, actionParts))
    return this
  }

  public requireMob(failMessage = CheckMessages.NoMob): CheckBuilder {
    const subject = this.request.getSubject()
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      collectionSearch(this.mobService.mobTable.getMobs(), subject),
      failMessage))

    return this
  }

  public requireMobInRoom(failMessage = CheckMessages.NoMob): CheckBuilder {
    const lastArg = this.request.getLastArg()
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      this.mobService.findMobInRoomWithMob(this.mob, mob => match(mob.name, lastArg)),
      failMessage))

    return this
  }

  public requireMerchant() {
    this.checks.push(this.newCheckComponent(
      CheckType.HasTarget,
      this.mobService.findMobInRoomWithMob(this.mob, (m: MobEntity) => m.isMerchant()),
      CheckMessages.NoMerchant,
    ))

    return this
  }

  public optionalMob(mob?: MobEntity) {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob))

    return this
  }

  public requirePlayer(mob: MobEntity, failMessage = CheckMessages.NotAPlayer): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.IsPlayer,
      new Maybe(mob).do((m: MobEntity) => !m.traits.isNpc ? m : null).or(() => false).get(),
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

  public forMob(mob: MobEntity) {
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
      (captured: any) =>
        (captured.affects ? captured : this.mob).affects.find((a: AffectEntity) => a.affectType === affectType),
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
      Maybe.if(
        this.mobService.findFightForMob(this.mob).get(),
        (f: Fight) => f.getOpponentFor(this.mob))
        .get(),
      failMessage))
    return this
  }

  public addCheck(checkComponent: CheckComponent): void {
    this.checks.push(checkComponent)
  }

  public async create(): Promise<Check> {
    this.checkResults = []

    return Maybe.if(this.findCheckFailure())
      .or(() => this.findCostFail())
      .or(() => Check.ok(this.captured, this.checkResults, this.costs))
      .get()
  }

  private findCostFail(): Check | void {
    return Maybe.if(
      this.costs.find(cost => !cost.canApplyTo(this.mob)),
      costFail => Check.fail(costFail.failMessage, this.checkResults, this.costs))
      .get()
  }

  private findCheckFailure(): Check | void {
    return Maybe.if(
      this.checks.find(checkComponent => this.testCheckComponent(checkComponent)),
      checkFail => Check.fail(this.getFailMessage(checkFail.failMessage), this.checkResults, this.costs))
      .get()
  }

  private testCheckComponent(checkComponent: CheckComponent) {
    const checkResult = checkComponent.getThing(this.captured, this.lastCheckResult)
    this.checkResults.push({ checkType: checkComponent.checkType, thing: checkResult })
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

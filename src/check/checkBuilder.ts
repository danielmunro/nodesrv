import { MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_NOT_AUTHORIZED, MESSAGE_FAIL_NOT_PLAYER } from "../action/constants"
import { AffectType } from "../affect/affectType"
import Maybe from "../functional/maybe"
import { Disposition } from "../mob/disposition"
import { getFights } from "../mob/fight/fight"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../player/authorizationLevel"
import { Messages } from "../skill/preconditions/constants"
import { SkillType } from "../skill/skillType"
import Check from "./check"
import CheckComponent from "./checkComponent"
import CheckResult from "./checkResult"
import { CheckType } from "./checkType"
import Cost from "./cost/cost"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private mob: Mob

  constructor(private target = null) {}

  public requireMob(mob: Mob, failMessage = MESSAGE_FAIL_NO_TARGET): CheckBuilder {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob, failMessage))

    return this
  }

  public requirePlayer(mob: Mob, failMessage = MESSAGE_FAIL_NOT_PLAYER): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.IsPlayer,
      new Maybe(mob).do(m => m.isPlayer).or(() => false).get(),
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

  public require(thing, failMessage, checkType: CheckType = CheckType.Unspecified) {
    this.checks.push(this.newCheckComponent(checkType, thing, failMessage))

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

  public requireSkill(skillType: SkillType) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasSkill,
      this.mob.skills.find(s => s.skillType === skillType),
      Messages.All.NoSkill))

    return this
  }

  public requireAffect(affectType: AffectType, failMessage: string) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasAffect,
      this.mob.getAffect(affectType),
      failMessage))

    return this
  }

  public requireDisposition(disposition: Disposition, failMessage: string) {
    this.checks.push(
      this.newCheckComponent(CheckType.Disposition, this.mob.disposition === disposition, failMessage))

    return this
  }

  public requireFight(failMessage: string = Messages.All.NoTarget) {
    this.checks.push(this.newCheckComponent(
      CheckType.IsFighting,
      new Maybe(getFights().find(f => f.isParticipant(this.mob)))
        .do(f => f.getOpponentFor(this.mob))
        .or(() => false)
        .get(),
      failMessage))

    return this
  }

  public async create(target = this.target): Promise<Check> {
    let lastThing = null
    const checkResults = []

    const checkFail = this.checks.find(checkComponent => {
      lastThing = checkComponent.getThing(lastThing)
      checkResults.push(new CheckResult(checkComponent.checkType, lastThing))
      return !lastThing
    })
    if (checkFail) {
      return Check.fail(checkFail.failMessage, this.checks, this.costs)
    }

    const costFail = this.costs.find(cost => !cost.canApplyTo(this.mob))
    if (costFail) {
      return Check.fail(costFail.failMessage, this.checks, this.costs)
    }

    return Check.ok(target ? target : lastThing, checkResults, this.costs)
  }

  private newCheckComponent(checkType: CheckType, thing, failMessage = ""): CheckComponent {
    const component = new CheckComponent(checkType, this.confirm ? thing : !thing, failMessage)
    this.confirm = true
    return component
  }
}

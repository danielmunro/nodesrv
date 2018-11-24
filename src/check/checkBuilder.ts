import { MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_NOT_AUTHORIZED, MESSAGE_FAIL_NOT_PLAYER } from "../action/constants"
import { AffectType } from "../affect/affectType"
import Maybe from "../functional/maybe"
import { Disposition } from "../mob/enum/disposition"
import MobService from "../mob/mobService"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../player/authorizationLevel"
import { Messages } from "../skill/precondition/constants"
import { SkillType } from "../skill/skillType"
import { SpellType } from "../spell/spellType"
import Check from "./check"
import CheckComponent from "./checkComponent"
import CheckResult from "./checkResult"
import { CheckType } from "./checkType"
import Cost from "./cost/cost"
import { CostType } from "./cost/costType"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private checkResults = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private mob: Mob
  private captured

  constructor(private readonly mobService: MobService) {}

  public requireMob(mob: Mob, failMessage = MESSAGE_FAIL_NO_TARGET): CheckBuilder {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob, failMessage))

    return this
  }

  public optionalMob(mob: Mob) {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob))

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

  public capture(toCapture = null) {
    this.checks.push(this.newCheckComponent(CheckType.Unspecified, thing =>
      this.captured = toCapture ? toCapture : thing))

    return this
  }

  public not(toCapture = null) {
    if (toCapture !== null) {
      this.capture(toCapture)
    }
    this.confirm = false

    return this
  }

  public addCost(cost: Cost) {
    this.costs.push(cost)

    return this
  }

  public addManaCost(amount: number) {
    this.costs.push(new Cost(CostType.Mana, amount, Messages.All.NotEnoughMana))

    return this
  }

  public forMob(mob: Mob) {
    this.mob = mob

    return this
  }

  public requireLevel(level: number) {
    this.checks.push(this.newCheckComponent(
      CheckType.Level,
      this.mob.level >= level,
      Messages.All.NotEnoughExperience))

    return this
  }

  public requireSkill(skillType: SkillType) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasSkill,
      this.mob.skills.find(s => s.skillType === skillType),
      Messages.All.NoSkill))

    return this
  }

  public requireSpell(spellType: SpellType) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasSpell,
      this.mob.spells.find(s => s.spellType === spellType),
      Messages.All.NoSpell))

    return this
  }

  public requireAffect(affectType: AffectType, failMessage: string) {
    this.checks.push(this.newCheckComponent(
      CheckType.HasAffect,
      captured => captured.affects.find(a => a.affectType === affectType),
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
      return Check.fail(costFail.failMessage, this.checks, this.costs)
    }
  }

  private async findCheckFailure() {
    let lastThing

    const checkFail = this.checks.find(checkComponent => {
      const checkResult = checkComponent.getThing(this.captured ? this.captured : lastThing)
      this.checkResults.push(new CheckResult(checkComponent.checkType, checkResult))
      lastThing = checkResult
      return !checkResult && checkComponent.isRequired
    })
    if (checkFail) {
      return Check.fail(checkFail.failMessage, this.checks, this.costs)
    }
  }

  private newCheckComponent(checkType: CheckType, thing, failMessage = null): CheckComponent {
    const component = new CheckComponent(checkType, this.confirm, thing, failMessage)
    this.confirm = true
    return component
  }
}

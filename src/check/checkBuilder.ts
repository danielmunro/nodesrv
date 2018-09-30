import { MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_NOT_AUTHORIZED, MESSAGE_FAIL_NOT_PLAYER } from "../action/constants"
import Maybe from "../functional/maybe"
import { Disposition } from "../mob/disposition"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../player/authorizationLevel"
import { Player } from "../player/model/player"
import Check from "./check"
import CheckComponent from "./checkComponent"
import { CheckType } from "./checkType"
import Cost from "./cost/cost"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private costs: Cost[] = []
  private confirm: boolean = true
  private player: Player

  constructor(private target = null) {}

  public requireMob(mob: Mob, failMessage = MESSAGE_FAIL_NO_TARGET): CheckBuilder {
    this.checks.push(this.newCheckComponent(CheckType.HasTarget, mob, failMessage))

    return this
  }

  public requirePlayer(mob: Mob, failMessage = MESSAGE_FAIL_NOT_PLAYER): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      CheckType.IsPlayer,
      new Maybe(mob).do((m) => m.isPlayer) .or(() => false).get(),
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

  public forPlayer(player: Player) {
    this.player = player

    return this
  }

  public requireDisposition(disposition: Disposition, failMessage: string) {
    this.checks.push(
      this.newCheckComponent(CheckType.Disposition, this.player.sessionMob.disposition === disposition, failMessage))

    return this
  }

  public async create(target = this.target): Promise<Check> {
    let lastThing = null

    const checkFail = this.checks.find(checkComponent => {
      lastThing = checkComponent.getThing()
      return !lastThing
    })
    if (checkFail) {
      return Check.fail(checkFail.failMessage, this.checks, this.costs)
    }

    const costFail = this.costs.find(cost => !cost.canApply(this.player))
    if (costFail) {
      return Check.fail(costFail.failMessage, this.checks, this.costs)
    }

    return Check.ok(target ? target : lastThing, this.checks, this.costs)
  }

  private newCheckComponent(checkType: CheckType, thing, failMessage = ""): CheckComponent {
    const component = new CheckComponent(checkType, this.confirm ? thing : !thing, failMessage)
    this.confirm = true
    return component
  }
}

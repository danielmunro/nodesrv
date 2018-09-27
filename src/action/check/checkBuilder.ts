import Maybe from "../../functional/maybe"
import { Mob } from "../../mob/model/mob"
import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../../player/authorizationLevel"
import { MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_NOT_AUTHORIZED, MESSAGE_FAIL_NOT_PLAYER } from "../constants"
import Check from "./check"
import CheckComponent from "./checkComponent"
import { CheckType } from "./checkType"

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private confirm: boolean = true

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

  public async create(target): Promise<Check> {
    return new Maybe(this.checks.find(checkComponent => !checkComponent.thing))
      .do(badCheck => Check.fail(badCheck.failMessage))
      .or(() => Check.ok(target, this.checks))
      .get()
  }

  private newCheckComponent(checkType: CheckType, thing, failMessage = ""): CheckComponent {
    const component = new CheckComponent(checkType, this.confirm ? thing : !thing, failMessage)
    this.confirm = true
    return component
  }
}

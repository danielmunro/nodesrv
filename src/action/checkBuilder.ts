import Maybe from "../functional/maybe"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../player/authorizationLevel"
import Check from "./check"
import CheckComponent from "./checkComponent"

export const MESSAGE_FAIL_NO_TARGET = "They aren't here."
export const MESSAGE_FAIL_NOT_PLAYER = "They are not a player."
export const MESSAGE_FAIL_NOT_AUTHORIZED = "You cannot do that."

export default class CheckBuilder {
  private checks: CheckComponent[] = []
  private confirm: boolean = true

  public requireTarget(mob: Mob, failMessage = MESSAGE_FAIL_NO_TARGET): CheckBuilder {
    this.checks.push(this.newCheckComponent(mob, failMessage))

    return this
  }

  public requirePlayer(mob: Mob, failMessage = MESSAGE_FAIL_NOT_PLAYER): CheckBuilder {
    this.checks.push(this.newCheckComponent(
      new Maybe(mob).do((m) => m.isPlayer) .or(() => false).get(),
      failMessage))

    return this
  }

  public requireAdmin(authorizationLevel: AuthorizationLevel, failMessage = MESSAGE_FAIL_NOT_AUTHORIZED) {
    this.checks.push(this.newCheckComponent(
      isSpecialAuthorizationLevel(authorizationLevel),
      failMessage))

    return this
  }

  public require(thing, failMessage) {
    this.checks.push(this.newCheckComponent(thing, failMessage))

    return this
  }

  public not() {
    this.confirm = false

    return this
  }

  public async create(target): Promise<Check> {
    return new Maybe(this.checks.find((checkComponent: CheckComponent) => !checkComponent.thing))
      .do((badCheck) => Check.fail(badCheck.failMessage))
      .or(() => Check.ok(target))
      .get()
  }

  private newCheckComponent(thing, failMessage): CheckComponent {
    const component = new CheckComponent(this.confirm ? thing : !thing, failMessage)
    this.confirm = true
    return component
  }
}

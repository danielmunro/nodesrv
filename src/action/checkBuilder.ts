import { Mob } from "../mob/model/mob"
import Check from "./check"
import { Request } from "../request/request"
import Maybe from "../functional/maybe"
import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../player/authorizationLevel"

export const MESSAGE_FAIL_NO_TARGET = "They aren't here."
export const MESSAGE_FAIL_NOT_PLAYER = "They are not a player."
export const MESSAGE_FAIL_NOT_AUTHORIZED = "You cannot do that."

export default class CheckBuilder {
  private target: Mob
  private targetRequired: boolean
  private requireTargetFail: string

  private isPlayer: boolean
  private playerRequired: boolean
  private requirePlayerFail: string

  private adminRequired: boolean
  private currentAuthorizationLevel: AuthorizationLevel

  public requireTarget(mob: Mob, failMessage = MESSAGE_FAIL_NO_TARGET): CheckBuilder {
    this.targetRequired = true
    this.target = mob
    this.requireTargetFail = failMessage

    return this
  }

  public requirePlayer(mob: Mob, failMessage = MESSAGE_FAIL_NOT_PLAYER): CheckBuilder {
    this.playerRequired = true
    this.isPlayer = new Maybe(mob).do((m) => m.isPlayer) .or(() => false).get()
    this.requirePlayerFail = failMessage

    return this
  }

  public requireAdmin(authorizationLevel: AuthorizationLevel) {
    this.adminRequired = true
    this.currentAuthorizationLevel = authorizationLevel
  }

  // public requireNonAdmin(authorizationLevel: AuthorizationLevel) {
  //   this.
  // }

  public async create(): Promise<Check> {
    if (this.targetRequired && !this.target) {
      return Check.fail(this.requireTargetFail)
    }

    if (this.playerRequired && !this.isPlayer) {
      return Check.fail(this.requirePlayerFail)
    }

    if (this.adminRequired && !isSpecialAuthorizationLevel(this.currentAuthorizationLevel)) {
      return Check.fail(MESSAGE_FAIL_NOT_AUTHORIZED)
    }

    return Check.ok(this.target)
  }
}

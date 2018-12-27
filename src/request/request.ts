import { ActionOutcome } from "../action/actionOutcome"
import { MESSAGE_FAIL_DEAD } from "../action/precondition/constants"
import CheckBuilder from "../check/checkBuilder"
import { Item } from "../item/model/item"
import { Disposition } from "../mob/enum/disposition"
import MobService from "../mob/mobService"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel } from "../player/authorizationLevel"
import { Room } from "../room/model/room"
import { Messages } from "./constants"
import InputContext from "./context/inputContext"
import RequestContext from "./context/requestContext"
import { RequestType } from "./requestType"
import ResponseAction from "./responseAction"
import ResponseBuilder from "./responseBuilder"

export class Request {
  constructor(
    public readonly mob: Mob,
    public readonly room: Room,
    public readonly context: RequestContext,
    private readonly target: Mob | Item = null) {}

  public getContextAsInput(): InputContext {
    return this.context as InputContext
  }

  public getType(): RequestType {
    return this.context.getRequestType()
  }

  public getRoom(): Room {
    return this.room
  }

  public findItemInSessionMobInventory(item = this.getContextAsInput().subject): Item | undefined {
    return this.mob.inventory.findItemByName(item)
  }

  public findItemInRoomInventory(item = this.getContextAsInput().subject): Item | undefined {
    return this.room.inventory.findItemByName(item)
  }

  public getTarget(): Mob | Item | null {
    return this.target
  }

  public getSubject(): string {
    return this.getContextAsInput().subject
  }

  public getAuthorizationLevel(): AuthorizationLevel {
    if (this.mob && this.mob.playerMob) {
      return this.mob.playerMob.authorizationLevel
    }

    return AuthorizationLevel.None
  }

  public respondWith(
    actionOutcome: ActionOutcome = ActionOutcome.None,
    thing: any = null): ResponseBuilder {
    return new ResponseBuilder(this, new ResponseAction(actionOutcome, thing))
  }

  public check(mobService: MobService): CheckBuilder {
    return new CheckBuilder(mobService)
      .forMob(this.mob)
      .not().requireDisposition(Disposition.Dead, MESSAGE_FAIL_DEAD)
  }

  public checkWithStandingDisposition(mobService: MobService): CheckBuilder {
    return this.check(mobService).requireDisposition(Disposition.Standing, Messages.NotStanding)
  }
}

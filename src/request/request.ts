import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel } from "../player/authorizationLevel"
import { Room } from "../room/model/room"
import InputContext from "./context/inputContext"
import RequestContext from "./context/requestContext"
import { RequestType } from "./requestType"
import ResponseBuilder from "./responseBuilder"

export class Request {
  constructor(
    public readonly mob: Mob,
    public readonly room: Room,
    public readonly context: RequestContext,
    private readonly targetMobInRoom?: Mob) {}

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

  public getTargetMobInRoom(): Mob | undefined {
    return this.targetMobInRoom
  }

  public getSubject(): string {
    return this.getContextAsInput().subject
  }

  public getComponent(): string {
    return this.getContextAsInput().component
  }

  public getLastArg(): string {
    return this.getContextAsInput().getLastArg()
  }

  public getAuthorizationLevel(): AuthorizationLevel {
    if (this.mob && this.mob.playerMob) {
      return this.mob.playerMob.authorizationLevel
    }

    return AuthorizationLevel.None
  }

  public respondWith(): ResponseBuilder {
    return new ResponseBuilder(this)
  }
}

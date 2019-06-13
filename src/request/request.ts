import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import {AuthorizationLevel} from "../player/enum/authorizationLevel"
import {Region} from "../region/model/region"
import {ExitEntity} from "../room/entity/exitEntity"
import { RoomEntity } from "../room/entity/roomEntity"
import ResponseBuilder from "./builder/responseBuilder"
import InputContext from "./context/inputContext"
import RequestContext from "./context/requestContext"
import { RequestType } from "./enum/requestType"

export default class Request {
  constructor(
    public readonly mob: Mob,
    private readonly room: RoomEntity,
    private readonly context: RequestContext,
    private readonly targetMobInRoom?: Mob) {}

  public getContextAsInput(): InputContext {
    return this.context as InputContext
  }

  public getRoom(): RoomEntity {
    return this.room
  }

  public getType(): RequestType {
    return this.context.requestType
  }

  public findItemInRoomInventory(item = this.getSubject()): Item | undefined {
    return this.room.inventory.findItemByName(item)
  }

  public findItemInSessionMobInventory(item = this.getSubject()): Item | undefined {
    return this.mob.inventory.findItemByName(item)
  }

  public getTargetMobInRoom(): Mob | undefined {
    return this.targetMobInRoom
  }

  public getRoomRegion(): Region {
    return this.room.region
  }

  public getRoomExits(): ExitEntity[] {
    return this.room.exits
  }

  public getRoomMvCost(): number {
    return this.room.getMovementCost()
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

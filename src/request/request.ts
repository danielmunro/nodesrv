import AffectService from "../affect/affectService"
import {AffectType} from "../affect/enum/affectType"
import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import { AuthorizationLevel } from "../player/authorizationLevel"
import {Region} from "../region/model/region"
import {Exit} from "../room/model/exit"
import { Room } from "../room/model/room"
import InputContext from "./context/inputContext"
import RequestContext from "./context/requestContext"
import { RequestType } from "./requestType"
import ResponseBuilder from "./responseBuilder"

export default class Request {
  constructor(
    public readonly mob: Mob,
    private readonly room: Room,
    private readonly context: RequestContext,
    private readonly targetMobInRoom?: Mob) {}

  public getContextAsInput(): InputContext {
    return this.context as InputContext
  }

  public getRoom(): Room {
    return this.room
  }

  public getType(): RequestType {
    return this.context.getRequestType()
  }

  public mobAffects(): AffectService {
    return new AffectService(this.mob)
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

  public getRoomExits(): Exit[] {
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

  public somethingIsGlowing() {
    return this.mob.equipped.find((item: Item) => item.affect().has(AffectType.Glow))
      || this.room.inventory.find((item: Item) => item.affect().has(AffectType.Glow))
  }

  public respondWith(): ResponseBuilder {
    return new ResponseBuilder(this)
  }
}

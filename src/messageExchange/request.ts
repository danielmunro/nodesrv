import Alias from "../action/type/alias"
import { ItemEntity } from "../item/entity/itemEntity"
import { MobEntity } from "../mob/entity/mobEntity"
import {AuthorizationLevel} from "../player/enum/authorizationLevel"
import {RegionEntity} from "../region/entity/regionEntity"
import {ExitEntity} from "../room/entity/exitEntity"
import { RoomEntity } from "../room/entity/roomEntity"
import ResponseBuilder from "./builder/responseBuilder"
import ClientRequest from "./clientRequest"
import InputContext from "./context/inputContext"
import RequestContext from "./context/requestContext"
import { RequestType } from "./enum/requestType"

export default class Request implements ClientRequest {
  private static getInputContextFromAlias(alias: Alias): InputContext {
    const aliasWords = alias.command.split(" ")
    return new InputContext(aliasWords[0] as RequestType, alias.command)
  }

  constructor(
    public readonly mob: MobEntity,
    private readonly room: RoomEntity,
    private readonly context: RequestContext,
    private readonly targetMobInRoom?: MobEntity) {
    if (mob && mob.isPlayerMob()) {
      const alias = this.getAlias()
      if (alias) {
        this.context = Request.getInputContextFromAlias(alias)
      }
    }
  }

  public getWord(index: number) {
    return this.getContextAsInput().words[index]
  }

  public getContextAsInput(): InputContext {
    return this.context as InputContext
  }

  public getRoom(): RoomEntity {
    return this.room
  }

  public getType(): RequestType {
    return this.context.requestType
  }

  public findItemInRoomInventory(item = this.getSubject()): ItemEntity | undefined {
    return this.room.inventory.findItemByName(item)
  }

  public findItemInSessionMobInventory(item = this.getSubject()): ItemEntity | undefined {
    return this.mob.inventory.findItemByName(item)
  }

  public getTargetMobInRoom(): MobEntity {
    return this.targetMobInRoom as MobEntity
  }

  public getRoomRegion(): RegionEntity {
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
    if (this.mob.isPlayerMob()) {
      return this.mob.playerMob.authorizationLevel
    }

    return AuthorizationLevel.None
  }

  public respondWith(): ResponseBuilder {
    return new ResponseBuilder(this)
  }

  public getMob(): MobEntity {
    return this.mob
  }

  private getAlias(): Alias | undefined {
    const command = this.getContextAsInput().command
    return this.mob.playerMob.aliases.find(a => a.alias === command)
  }
}

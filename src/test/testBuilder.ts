import getActionCollection from "../action/actionCollection"
import Check from "../action/check/check"
import CheckComponent from "../action/check/checkComponent"
import CheckedRequest from "../action/check/checkedRequest"
import { CheckStatus } from "../action/check/checkStatus"
import { Collection } from "../action/definition/collection"
import { DamageType } from "../damage/damageType"
import { newWeapon } from "../item/factory"
import { Item } from "../item/model/item"
import { WeaponType } from "../item/weaponType"
import { Mob } from "../mob/model/mob"
import { Role } from "../mob/role"
import { AuthorizationLevel } from "../player/authorizationLevel"
import { Player } from "../player/model/player"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import Service from "../service/service"
import { getTestMob } from "./mob"
import MobBuilder from "./mobBuilder"
import { getTestPlayer } from "./player"
import PlayerBuilder from "./playerBuilder"
import RoomBuilder from "./roomBuilder"

export default class TestBuilder {
  public player: Player
  public room: Room
  private service: Service

  public withRoom() {
    this.room = newRoom("a test room", "description of a test room")
    if (this.player) {
      this.room.addMob(this.player.sessionMob)
    }

    return new RoomBuilder(this.room)
  }

  public async withPlayer(fn = null): Promise<PlayerBuilder> {
    this.player = getTestPlayer()

    if (this.room) {
      this.room.addMob(this.player.sessionMob)
    }

    if (fn) {
      fn(this.player)
    }

    return new PlayerBuilder(this.player, await this.getService())
  }

  public addWeaponToPlayerInventory(): Item {
    const weapon = newWeapon(
      "a practice mace",
      "A wooden practice mace",
      WeaponType.Axe,
      DamageType.Slash)
    this.player.sessionMob.inventory.addItem(weapon)

    return weapon
  }

  public async withAdminPlayer(
    authorizationLevel: AuthorizationLevel = AuthorizationLevel.Admin): Promise<PlayerBuilder> {
    const playerBuilder = await this.withPlayer()
    playerBuilder.player.sessionMob.playerMob.authorizationLevel = authorizationLevel

    return playerBuilder
  }

  public withMob(name: string = null): MobBuilder {
    const mob = getTestMob(name)
    if (!this.room) {
      this.withRoom()
    }
    this.room.addMob(mob)

    return new MobBuilder(mob)
  }

  public withTrainer(name: string = null): MobBuilder {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.role = Role.Trainer

    return mobBuilder
  }

  public withMerchant() {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.role = Role.Merchant

    return mobBuilder
  }

  public with(fn) {
    fn(this.player)
  }

  public createOkCheckedRequest(
    requestType: RequestType,
    input: string = null,
    result: any = null,
    checkComponents: CheckComponent[]): CheckedRequest {
    return this.createCheckedRequest(requestType, CheckStatus.Ok, input, result, checkComponents)
  }

  public createRequest(requestType: RequestType, input: string = requestType, target: Mob = null): Request {
    return new Request(this.player, requestType, input, target)
  }

  public async getActionCollection(): Promise<Collection> {
    return getActionCollection(await this.getService())
  }

  public async getService(): Promise<Service> {
    if (!this.service) {
      this.service = await Service.new()
    }
    return this.service
  }

  private createCheckedRequest(
    requestType: RequestType,
    checkStatus: CheckStatus,
    input: string = null,
    result: any = null,
    checkComponents: CheckComponent[] = []): CheckedRequest {
    if (!input) {
      input = requestType.toString()
    }
    return new CheckedRequest(
      new Request(this.player, requestType, input),
      new Check(checkStatus, result, checkComponents),
    )
  }
}

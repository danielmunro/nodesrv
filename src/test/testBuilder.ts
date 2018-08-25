import getActionCollection from "../action/actionCollection"
import Check, { CheckStatus } from "../action/check"
import CheckedRequest from "../action/checkedRequest"
import { Mob } from "../mob/model/mob"
import { Role } from "../mob/role"
import { Player } from "../player/model/player"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import Service from "../room/service"
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

  public withPlayer(): PlayerBuilder {
    this.player = getTestPlayer()
    if (this.room) {
      this.room.addMob(this.player.sessionMob)
    }

    return new PlayerBuilder(this.player)
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

  public createOkCheckedRequest(requestType: RequestType, input: string = null, result: any = null): CheckedRequest {
    return this.createCheckedRequest(requestType, CheckStatus.Ok, input, result)
  }

  public createRequest(requestType: RequestType, input: string, target: Mob = null): Request {
    return new Request(this.player, requestType, input, target)
  }

  public async getActionCollection() {
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
    result: any = null): CheckedRequest {
    if (!input) {
      input = requestType.toString()
    }
    return new CheckedRequest(
      new Request(this.player, requestType, input),
      new Check(checkStatus, result),
    )
  }
}

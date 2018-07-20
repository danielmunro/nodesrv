import Check, { CheckStatus } from "../action/check"
import CheckedRequest from "../action/checkedRequest"
import { Role } from "../mob/role"
import { Player } from "../player/model/player"
import { createRequestArgs, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { getTestMob } from "./mob"
import MobBuilder from "./mobBuilder"
import { getTestPlayer } from "./player"
import PlayerBuilder from "./playerBuilder"
import RoomBuilder from "./roomBuilder"

export default class TestBuilder {
  public player: Player
  public room: Room

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

  public withMob(name: string = null) {
    const mob = getTestMob(name)
    if (!this.room) {
      this.withRoom()
    }
    this.room.addMob(mob)

    return new MobBuilder(mob)
  }

  public withTrainer(name: string = null) {
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

  public createFailedCheckedRequest(requestType: RequestType, input: string = null, result: any = null): CheckedRequest {
    return this.createCheckedRequest(requestType, CheckStatus.Failed, input, result)
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
      new Request(this.player, requestType, createRequestArgs(input)),
      new Check(checkStatus, result),
    )
  }

  public createRequest(requestType: RequestType, input: string = null): Request {
    if (input === null) {
      input = requestType.toString()
    }
    return new Request(this.player, requestType, createRequestArgs(input))
  }
}

import Check, { CheckStatus } from "../handler/check"
import CheckedRequest from "../handler/checkedRequest"
import { getMerchantMob } from "../mob/factory"
import { Player } from "../player/model/player"
import { createRequestArgs, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import MobBuilder from "./mobBuilder"
import { getTestPlayer } from "./player"
import PlayerBuilder from "./playerBuilder"

export default class TestBuilder {
  public player: Player
  public room: Room

  public withRoom() {
    this.room = newRoom("a test room", "description of a test room")
    if (this.player) {
      this.room.addMob(this.player.sessionMob)
    }
  }

  public withPlayer(): PlayerBuilder {
    this.player = getTestPlayer()
    if (this.room) {
      this.room.addMob(this.player.sessionMob)
    }

    return new PlayerBuilder(this.player)
  }

  public withMerchant() {
    const merchant = getMerchantMob()
    if (!this.room) {
      this.withRoom()
    }
    this.room.addMob(merchant)

    return new MobBuilder(merchant)
  }

  public createOkCheckedRequest(requestType: RequestType, input: string, result: any) {
    return new CheckedRequest(
      new Request(this.player, requestType, createRequestArgs(input)),
      new Check(CheckStatus.Ok, result),
    )
  }
}

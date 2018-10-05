import match from "../matcher/match"
import Table from "../mob/table"
import { Player } from "../player/model/player"
import { Request } from "./request"
import { RequestType } from "./requestType"

export default class RequestBuilder {
  constructor(private readonly player: Player, private readonly mobTable: Table = new Table()) {}

  public create(requestType: RequestType, input: string = null): Request {
    if (!input) {
      input = requestType.toString()
    }
    const words = input.split(" ")
    const find = words[words.length - 1]
    const target = this.mobTable.find((mob) => match(mob.name, find))

    return new Request(this.player.sessionMob, requestType, input, target)
  }
}

import match from "../matcher/match"
import { Mob } from "../mob/model/mob"
import Table from "../mob/table"
import { Room } from "../room/model/room"
import InputContext from "./context/inputContext"
import { Request } from "./request"
import { RequestType } from "./requestType"

export default class RequestBuilder {
  constructor(private readonly mob: Mob, private readonly room: Room, private readonly mobTable: Table = new Table()) {}

  public create(requestType: RequestType, input: string = null): Request {
    if (!input) {
      input = requestType.toString()
    }
    const words = input.split(" ")
    const find = words[words.length - 1]
    const target = this.mobTable.find((mob) => match(mob.name, find))

    return new Request(this.mob, this.room, new InputContext(requestType, input), target)
  }
}

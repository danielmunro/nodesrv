import { Mob } from "../mob/model/mob"
import { Room } from "../room/model/room"
import InputContext from "./context/inputContext"
import { Request } from "./request"
import { RequestType } from "./requestType"

export default class RequestBuilder {
  constructor(
    private readonly mob: Mob,
    private readonly room?: Room) {}

  public create(requestType: RequestType, input?: string): Request {
    if (!input) {
      input = requestType.toString()
    }

    return new Request(this.mob, this.room, new InputContext(requestType, input))
  }
}

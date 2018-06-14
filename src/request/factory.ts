import { RequestType } from "./requestType"
import { Player } from "../player/model/player"
import { createRequestArgs, Request } from "./request"

export function createCastRequest(player: Player, input: string): Request {
  return new Request(player, RequestType.Cast, createRequestArgs(input))
}

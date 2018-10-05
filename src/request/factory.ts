import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { Request } from "./request"
import { RequestType } from "./requestType"

export function createCastRequest(player: Player, input: string, target: Mob = null): Request {
  return new Request(player.sessionMob, RequestType.Cast, input, target)
}

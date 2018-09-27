import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { gossip } from "../social"

export default function(request: Request): Promise<Response> {
  gossip(request.player, request.player.sessionMob.name + " gossips, \"" + request.message + "\"")
  return request.respondWith().info("You gossip, '" + request.message + "'")
}

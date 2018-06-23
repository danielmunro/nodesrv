import { Request } from "../../request/request"
import { gossip } from "../social"
import Response from "../../request/response"

export default function(request: Request): Promise<Response> {
  gossip(request.player, request.player.sessionMob.name + " gossips, \"" + request.message + "\"")
  return Response.ok(request, "You gossip, '" + request.message + "'")
}

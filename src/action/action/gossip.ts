import { Request } from "../../request/request"
import Response from "../../request/response"
import { gossip } from "../social"

export default function(request: Request): Promise<Response> {
  gossip(request.mob, request.mob.name + " gossips, \"" + request.getContextAsInput().message + "\"")
  return request.respondWith().info("You gossip, '" + request.getContextAsInput().message + "'")
}

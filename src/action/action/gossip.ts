import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { gossip } from "../social"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  gossip(request.mob, request.mob.name + " gossips, \"" + request.getContextAsInput().message + "\"")
  return request.respondWith().info("You gossip, '" + request.getContextAsInput().message + "'")
}

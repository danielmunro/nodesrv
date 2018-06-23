import { Request } from "../../request/request"
import Response from "../../request/response"

export default function(request: Request): Promise<Response> {
  return request.ok(request.player.getInventory().toString())
}

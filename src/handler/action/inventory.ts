import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export default function(request: Request): Promise<Response> {
  return new ResponseBuilder(request).info(request.player.getInventory().toString())
}

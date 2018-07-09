import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export default function(request: Request): Promise<Response> {
  return new ResponseBuilder(request).info("You are wearing:\n" +
        request.player.sessionMob.equipped.inventory.getItems().map(
          (item) => item.name).join("\n"))
}

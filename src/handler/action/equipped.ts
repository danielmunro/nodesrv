import { Request } from "../../request/request"
import Response from "../../request/response"

export default function(request: Request): Promise<Response> {
  return request.ok("You are wearing:\n" +
        request.player.sessionMob.equipped.inventory.getItems().map(
          (item) => item.name).join("\n"))
}

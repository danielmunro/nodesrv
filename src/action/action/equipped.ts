import { Request } from "../../request/request"
import Response from "../../request/response"

export default function(request: Request): Promise<Response> {
  return request.respondWith().info("You are wearing:\n" +
        request.mob.equipped.inventory.getItems().map(
          item => item.name).join("\n"))
}

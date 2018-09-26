import { Request } from "../../request/request"
import Response from "../../request/response"
import Service from "../../service/service"

export default function(request: Request, service: Service): Promise<Response> {
  return request.respondWith()
    .info("Your inventory:\n" +
      service.itemTable.findByInventory(request.player.getInventory())
        .reduce((previous, current) => previous + current.name + "\n", ""))
}

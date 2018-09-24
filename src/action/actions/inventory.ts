import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import Service from "../../room/service"

export default function(request: Request, service: Service): Promise<Response> {
  return new ResponseBuilder(request)
    .info("Your inventory:\n" +
      service.itemTable.findByInventory(request.player.getInventory())
        .reduce((previous, current) => previous + current.name + "\n", ""))
}

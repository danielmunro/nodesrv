import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export default function(request: Request): Promise<Response> {
  const eq = request.player.sessionMob.equipped.inventory
  const item = eq.findItemByName(request.subject)
  request.player.getInventory().getItemFrom(item, eq)

  return new ResponseBuilder(request).info(`You remove ${item.name} and put it in your inventory.`)
}

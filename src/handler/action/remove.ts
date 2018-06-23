import { Item } from "../../item/model/item"
import { Request } from "../../request/request"
import Response from "../../request/response"
import { doWithItemOrElse } from "../actionHelpers"
import ResponseBuilder from "../../request/responseBuilder"

export const MESSAGE_FAIL = "You aren't wearing that."

export default function(request: Request): Promise<Response> {
  const eq = request.player.sessionMob.equipped.inventory
  return doWithItemOrElse(
    request,
    eq.findItemByName(request.subject),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, eq)
      return new ResponseBuilder(request).info(`You remove ${item.name} and put it in your inventory.`)
    },
    MESSAGE_FAIL)
}

import { Item } from "../../item/model/item"
import { Request } from "../../request/request"
import Response from "../../request/response"
import { doWithItemOrElse } from "../actionHelpers"

export const MESSAGE_FAIL = "You aren't wearing that."

export default function(request: Request): Promise<Response> {
  const eq = request.player.sessionMob.equipped.inventory
  return doWithItemOrElse(
    eq.findItemByName(request.subject),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, eq)
      return request.ok(`You remove ${item.name} and put it in your inventory.`)
    },
    MESSAGE_FAIL)
}

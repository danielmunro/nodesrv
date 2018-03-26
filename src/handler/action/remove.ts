import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { doWithItemOrElse } from "./actions"

export default function(request: Request): Promise<any> {
  const eq = request.player.sessionMob.equipped.inventory
  return doWithItemOrElse(
    eq.findItemByName(request.subject),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, eq)
      return { message: "You remove " + item.name + " and put it in your inventory." }
    },
    "You aren't wearing that.")
}

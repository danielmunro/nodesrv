import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { doWithItemOrElse } from "./actions"

export default function(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInSessionMobInventory(),
    (item: Item) => {
      request.getRoom().inventory.getItemFrom(item, request.player.getInventory())

      return { message: "You drop " + item.name + "." }
    },
    "You don't have that.")
}

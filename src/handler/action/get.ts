import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { doWithItemOrElse } from "./actions"

export default function(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInRoomInventory(),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, request.getRoom().inventory)

      return { message: "You pick up " + item.name + "." }
    },
    "You can't find that anywhere.")
}

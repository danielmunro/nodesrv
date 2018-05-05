import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { doWithItemOrElse } from "../actions"
import { MESSAGE_ITEM_NOT_FOUND } from "./constants"

export default function(request: Request): Promise<any> {
  return doWithItemOrElse(
    request.findItemInRoomInventory(),
    (item: Item) => {
      request.player.getInventory().getItemFrom(item, request.getRoom().inventory)

      return { message: "You pick up " + item.name + "." }
    },
    MESSAGE_ITEM_NOT_FOUND)
}

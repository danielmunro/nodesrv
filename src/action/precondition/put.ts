import Maybe from "../../functional/maybe"
import { Request } from "../../request/request"
import Check from "../check"
import CheckBuilder from "../checkBuilder"
import { MESSAGE_FAIL_CONTAINER_NOT_FOUND, MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY } from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.findItemInSessionMobInventory()
  const container = new Maybe(request.findItemInSessionMobInventory())
    .or(() => request.findItemInRoomInventory())
    .get()

  return new CheckBuilder()
    .require(item, MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY)
    .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND)
    .create(item)
}

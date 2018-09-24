import Maybe from "../../functional/maybe"
import { Request } from "../../request/request"
import Check from "../check/check"
import CheckBuilder from "../check/checkBuilder"
import { CheckType } from "../check/checkType"
import { MESSAGE_FAIL_CONTAINER_NOT_FOUND, MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY } from "./constants"

export default function(request: Request): Promise<Check> {
  const containerName = request.component
  const item = request.findItemInSessionMobInventory(containerName)
  const container = new Maybe(request.findItemInSessionMobInventory(containerName))
    .do((i) => i)
    .or(() => request.findItemInRoomInventory())
    .get()

  return new CheckBuilder()
    .require(item, MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY, CheckType.HasItem)
    .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND, CheckType.ContainerPresent)
    .create(item)
}

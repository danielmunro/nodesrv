import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Equipped } from "../../item/model/equipped"
import { Inventory } from "../../item/model/inventory"
import { Item } from "../../item/model/item"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const mob = checkedRequest.mob

  return checkedRequest.respondWith().success(
    new ResponseMessage(wear(
      mob.inventory,
      mob.equipped,
      checkedRequest.getCheckTypeResult(CheckType.HasItem),
      mob.equipped.byPosition(item.equipment))))
}

function wear(inventory: Inventory, equipped: Equipped, item: Item, currentlyEquipped?: Item): string {
  let removal = ""

  if (currentlyEquipped) {
    inventory.addItem(currentlyEquipped)
    removal = ` remove ${currentlyEquipped.name} and`
  }

  equipped.inventory.addItem(item)

  return `You${removal} wear ${item.name}.`
}

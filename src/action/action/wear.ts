import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Inventory } from "../../item/model/inventory"
import { Item } from "../../item/model/item"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const mob = checkedRequest.mob

  return checkedRequest.respondWith().success(
    wear(
      mob.inventory,
      mob.equipped,
      checkedRequest.getCheckTypeResult(CheckType.HasItem),
      mob.equipped.find(i => i.equipment === item.equipment)))
}

function wear(inventory: Inventory, equipped: Inventory, item: Item, currentlyEquipped?: Item): string {
  let removal = ""

  if (currentlyEquipped) {
    inventory.addItem(currentlyEquipped)
    removal = ` remove ${currentlyEquipped.name} and`
  }

  equipped.addItem(item)

  return `You${removal} wear ${item.name}.`
}

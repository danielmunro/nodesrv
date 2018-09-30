import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const playerEquipped = checkedRequest.request.mob.equipped
  const item = checkedRequest.check.result
  const currentlyEquippedItem = playerEquipped.inventory.find((eq) => eq.equipment === item.equipment)

  let removal = ""
  if (currentlyEquippedItem) {
    const playerInv = checkedRequest.request.mob.inventory
    playerInv.getItemFrom(currentlyEquippedItem, playerEquipped.inventory)
    removal = ` remove ${currentlyEquippedItem.name} and`
  }

  playerEquipped.inventory.addItem(item)

  return checkedRequest.request.respondWith().success(`You${removal} wear ${item.name}.`)
}

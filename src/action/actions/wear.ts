import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../check/checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const playerInv = checkedRequest.request.player.getInventory()
  const playerEquipped = checkedRequest.request.player.sessionMob.equipped
  const item = checkedRequest.check.result
  const currentlyEquippedItem = playerEquipped.inventory.find((eq) => eq.equipment === item.equipment)

  let removal = ""
  if (currentlyEquippedItem) {
    playerInv.getItemFrom(currentlyEquippedItem, playerEquipped.inventory)
    removal = ` remove ${currentlyEquippedItem.name} and`
  }

  playerEquipped.inventory.getItemFrom(item, playerInv)

  return checkedRequest.request.respondWith().success(`You${removal} wear ${item.name}.`)
}

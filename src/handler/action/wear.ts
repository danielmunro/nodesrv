import { Item } from "../../item/model/item"
import { Request } from "../../request/request"
import { doWithItemOrElse } from "../actionHelpers"

export const ITEM_NOT_FOUND = "You don't have that."

export default function(request: Request): Promise<any> {
  return doWithItemOrElse(
    request,
    request.findItemInSessionMobInventory(),
    (item: Item) => {
      const playerInv = request.player.getInventory()
      const playerEquipped = request.player.sessionMob.equipped
      const currentlyEquippedItem = playerEquipped.inventory.find((eq) => eq.equipment === item.equipment)

      let removal = ""
      if (currentlyEquippedItem) {
        playerInv.getItemFrom(currentlyEquippedItem, playerEquipped.inventory)
        removal = " remove " + currentlyEquippedItem.name + " and"
      }

      playerEquipped.inventory.getItemFrom(item, playerInv)

      return { message: "You" + removal + " wear " + item.name + "." }
    },
    ITEM_NOT_FOUND)
}

import { copy } from "../../item/factory"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export const MESSAGE_ERROR_NO_MERCHANT = "You don't see a merchant anywhere."
export const MESSAGE_ERROR_NO_ITEM = "They don't have that."
export const MESSAGE_ERROR_CANNOT_AFFORD = "You can't afford it."

export default function(request: Request): Promise<Response> {
  const builder = new ResponseBuilder(request)
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return builder.error(MESSAGE_ERROR_NO_MERCHANT)
  }

  const item = merchant.inventory.findItemByName(request.subject)

  if (!item) {
    return builder.error(MESSAGE_ERROR_NO_ITEM)
  }

  const mob = request.player.sessionMob

  if (mob.gold < item.value) {
    return builder.fail(MESSAGE_ERROR_CANNOT_AFFORD)
  }

  const purchase = copy(item)
  mob.inventory.addItem(purchase)
  mob.gold -= item.value

  return builder.success(`You purchase ${item.name} for ${item.value} gold`)
}

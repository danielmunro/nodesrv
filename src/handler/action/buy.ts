import { copy } from "../../item/factory"
import { Request } from "../../request/request"
import Response from "../../request/response"

export default function(request: Request): Promise<Response> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return request.fail("You don't see a merchant anywhere.")
  }

  const item = merchant.inventory.findItemByName(request.subject)

  if (!item) {
    return request.fail("They don't have that.")
  }

  const mob = request.player.sessionMob

  if (mob.gold < item.value) {
    return request.fail("You can't afford it.")
  }

  const purchase = copy(item)
  mob.inventory.addItem(purchase)
  mob.gold -= item.value

  return request.ok(`You purchase ${item.name} for ${item.value} gold`)
}

import { copy } from "../../item/factory"
import { Request } from "../../request/request"

export default function(request: Request): Promise<any> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return new Promise((resolve) => resolve({ message: "You don't see a merchant anywhere." }))
  }

  const item = merchant.inventory.findItemByName(request.subject)

  if (!item) {
    return new Promise((resolve) => resolve({ message: "They don't have that." }))
  }

  const mob = request.player.sessionMob

  if (mob.gold < item.value) {
    return new Promise((resolve) => resolve({ message: "You can't afford it." }))
  }

  const purchase = copy(item)
  mob.inventory.addItem(purchase)
  mob.gold -= item.value
}

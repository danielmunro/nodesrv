import { Request } from "../../request/request"

export default function(request: Request): Promise<any> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return new Promise((resolve) => resolve({ message: "You don't see a merchant anywhere." }))
  }

  const mob = request.player.sessionMob
  const item = mob.inventory.findItemByName(request.subject)

  if (!item) {
    return new Promise((resolve) => resolve({ message: "You don't have that." }))
  }

  mob.inventory.removeItem(item)
  merchant.inventory.addItem(item)
  mob.gold += item.value
}

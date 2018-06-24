import { copy } from "../../item/factory"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export default function(request: Request): Promise<Response> {
  const builder = new ResponseBuilder(request)
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())
  const item = merchant.inventory.findItemByName(request.subject)
  const mob = request.player.sessionMob
  const purchase = copy(item)
  mob.inventory.addItem(purchase)
  mob.gold -= item.value

  return builder.success(`You purchase ${item.name} for ${item.value} gold`)
}

import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const item = checkedRequest.check.result
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())
  const mob = request.player.sessionMob

  mob.inventory.removeItem(item)
  merchant.inventory.addItem(item)
  mob.gold += item.value

  return new ResponseBuilder(request).success(`You sell ${item.name} for ${item.value} gold`)
}

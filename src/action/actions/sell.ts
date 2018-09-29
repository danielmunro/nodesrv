import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { ActionOutcome } from "../actionOutcome"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const item = checkedRequest.check.result
  const mob = request.player.sessionMob

  mob.inventory.removeItem(item)
  mob.gold += item.value

  return request
    .respondWith(ActionOutcome.ItemDestroyed, item)
    .success(`You sell ${item.name} for ${item.value} gold`)
}

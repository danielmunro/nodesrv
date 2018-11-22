import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { Messages } from "./constants"
import { Item } from "../../item/model/item"
import { AffectType } from "../../affect/affectType"
import { ActionOutcome } from "../actionOutcome"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result as Item
  const room = checkedRequest.request.getRoom()
  let actionOutcome = null

  if (item.affects.find(a => a.affectType === AffectType.MeltDrop)) {
    actionOutcome = ActionOutcome.ItemDestroyed
  } else {
    room.inventory.addItem(item)
  }

  return checkedRequest.respondWith(actionOutcome, item).success(
    Messages.Drop.Success,
    { item, verb: "drop" },
    { item, verb: "drops" })
}

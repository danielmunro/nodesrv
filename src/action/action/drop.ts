import {AffectType} from "../../affect/affectType"
import CheckedRequest from "../../check/checkedRequest"
import MobEvent from "../../mob/event/mobEvent"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import {Item} from "../../item/model/item"
import Response from "../../request/response"
import {ActionOutcome} from "../actionOutcome"
import {Messages} from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const item = checkedRequest.check.result as Item
  const room = checkedRequest.request.getRoom()
  let actionOutcome = null

  if (item.affects.find(a => a.affectType === AffectType.MeltDrop)) {
    actionOutcome = ActionOutcome.ItemDestroyed
  } else {
    room.inventory.addItem(item)
  }

  await service.publishEvent(new MobEvent(EventType.ItemDropped, checkedRequest.mob, item))

  return checkedRequest.respondWith(actionOutcome, item).success(
    Messages.Drop.Success,
    { item, verb: "drop" },
    { item, verb: "drops" })
}

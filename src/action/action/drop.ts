import {AffectType} from "../../affect/affectType"
import CheckedRequest from "../../check/checkedRequest"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import ItemEvent from "../../item/event/itemEvent"
import {Item} from "../../item/model/item"
import MobEvent from "../../mob/event/mobEvent"
import Response from "../../request/response"
import {Messages} from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const item = checkedRequest.check.result as Item
  const room = checkedRequest.request.getRoom()

  if (item.affects.find(a => a.affectType === AffectType.MeltDrop)) {
    await service.publishEvent(new ItemEvent(EventType.ItemDestroyed, item))
  } else {
    room.inventory.addItem(item)
  }

  await service.publishEvent(new MobEvent(EventType.ItemDropped, checkedRequest.mob, item))

  return checkedRequest.respondWith().success(
    Messages.Drop.Success,
    { item, verb: "drop" },
    { item, verb: "drops" })
}

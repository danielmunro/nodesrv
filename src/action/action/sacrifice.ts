import CheckedRequest from "../../check/checkedRequest"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import ItemEvent from "../../item/event/itemEvent"
import Response from "../../request/response"
import { Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()
  room.inventory.removeItem(item)
  const value = Math.max(1, item.value / 10)
  checkedRequest.request.mob.gold += value
  await service.publishEvent(new ItemEvent(EventType.ItemDestroyed, item))

  return checkedRequest
    .respondWith()
    .success(Messages.Sacrifice.Success, item.name, value)
}

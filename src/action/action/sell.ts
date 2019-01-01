import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import ItemEvent from "../../item/event/itemEvent"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  await service.publishEvent(new ItemEvent(EventType.ItemDestroyed, item))

  return checkedRequest
    .respondWith()
    .success(sell(checkedRequest.mob, item))
}

function sell(mob: Mob, item: Item) {
  mob.inventory.removeItem(item)
  mob.gold += item.value

  return format(Messages.Sell.Success, item.name, item.value)
}

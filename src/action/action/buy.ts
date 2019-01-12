import { cloneDeep } from "lodash"
import CheckedRequest from "../../check/checkedRequest"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import ItemEvent from "../../item/event/itemEvent"
import Response from "../../request/response"
import { Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const request = checkedRequest.request
  const item = cloneDeep(checkedRequest.check.result)
  request.mob.inventory.addItem(item)
  request.mob.gold -= item.value
  await service.publishEvent(new ItemEvent(EventType.ItemCreated, item))
  const replacements = {
    item,
    value: item.value,
  }
  return request
    .respondWith()
    .success(Messages.Buy.Success,
      { verb: "buy", ...replacements },
      { verb: "buys", ...replacements })
}

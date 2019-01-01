import CheckedRequest from "../../check/checkedRequest"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import ItemEvent from "../../item/event/itemEvent"
import {Item} from "../../item/model/item"
import Response from "../../request/response"
import {Messages} from "./constants"

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const mob = checkedRequest.request.mob
  const item = checkedRequest.check.result as Item

  mob.playerMob.eat(item)
  mob.inventory.removeItem(item)

  const affects = item.affects.length > 0 ? ", and suddenly feel different" : ""
  const full = mob.playerMob.hunger === mob.playerMob.appetite ? ". You feel full" : ""
  const replacements = { item, affects }
  await service.publishEvent(new ItemEvent(EventType.ItemDestroyed, item))

  return checkedRequest
    .respondWith()
    .success(
      Messages.Eat.Success,
      { verb: "eat", full, ...replacements },
      { verb: "eats", full: "", ...replacements })
}

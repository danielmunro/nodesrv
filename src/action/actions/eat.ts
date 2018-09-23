import { Item } from "../../item/model/item"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../check/checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.request.mob
  const item = checkedRequest.check.result as Item
  mob.playerMob.eat(item)
  mob.inventory.removeItem(item)
  const affects = item.affects.length > 0 ? ", and suddenly feel different" : ""
  const full = mob.playerMob.hunger === mob.playerMob.appetite ? ". You feel full" : ""

  return new ResponseBuilder(checkedRequest.request).success(
    `You eat ${item.name}${affects}${full}.`)
}

import Response from "../../request/response"
import CheckedRequest from "../checkedRequest"
import { Item } from "../../item/model/item"
import ResponseBuilder from "../../request/responseBuilder"
import appetite from "../../mob/race/appetite"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.request.mob
  const item = checkedRequest.check.result as Item
  mob.eat(item)
  const affects = item.affects.length > 0 ? ", and suddenly feel different" : ""
  const full = mob.hunger === appetite(mob.race) ? ". You feel full" : ""

  return new ResponseBuilder(checkedRequest.request).success(
    `You eat ${item.name}${affects}${full}.`)
}

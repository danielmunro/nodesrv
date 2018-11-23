import CheckedRequest from "../../check/checkedRequest"
import match from "../../matcher/match"
import { onlyLiving } from "../../mob/enum/disposition"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import Service from "../../service/service"
import { NOT_FOUND } from "./constants"

function lookAtSubject(request: Request, builder: ResponseBuilder, service: Service) {
  const mob = service.getMobsByRoom(request.room).find(m => match(m.name, request.getSubject()))
  if (mob) {
    return builder.info(mob.description)
  }

  const subject = request.getContextAsInput().subject

  let item = service.itemTable.findItemByInventory(request.getRoom().inventory, subject)
  if (item) {
    return builder.info(item.describe())
  }

  item = service.itemTable.findItemByInventory(request.mob.inventory, subject)
  if (item) {
    return builder.info(item.describe())
  }

  return builder.error(NOT_FOUND)
}

export default function(checkedRequest: CheckedRequest, service: Service): Promise<Response> {
  const builder = checkedRequest.respondWith()
  const request = checkedRequest.request

  if (request.getContextAsInput().subject) {
    return lookAtSubject(request, builder, service)
  }

  const location = service.getMobLocation(request.mob)
  const room = location.room

  return builder.info(
    room.toString()
    + reduceMobs(request.mob, service.getMobsByRoom(room))
    + room.inventory.toString("is here."))
}

function reduceMobs(mob: Mob, mobs: Mob[]): string {
  return mobs.filter(onlyLiving).reduce((previous: string, current: Mob) =>
    previous + (current !== mob ? `\n${current.name} is here.` : ""), "")
}

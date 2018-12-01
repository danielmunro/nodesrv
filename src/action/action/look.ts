import CheckedRequest from "../../check/checkedRequest"
import GameService from "../../gameService/gameService"
import { onlyLiving } from "../../mob/enum/disposition"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import match from "../../support/matcher/match"
import { NOT_FOUND } from "./constants"

function lookAtSubject(request: Request, builder: ResponseBuilder, service: GameService) {
  const mob = service.getMobsByRoom(request.room).find(m => match(m.name, request.getSubject()))
  if (mob) {
    return builder.info(mob.describe())
  }

  const subject = request.getContextAsInput().subject

  let item = service.itemService.findItem(request.getRoom().inventory, subject)
  if (item) {
    return builder.info(item.describe())
  }

  item = service.itemService.findItem(request.mob.inventory, subject)
  if (item) {
    return builder.info(item.describe())
  }

  return builder.error(NOT_FOUND)
}

export default function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
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

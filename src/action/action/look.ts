import { AffectType } from "../../affect/affectType"
import match from "../../matcher/match"
import { onlyLiving } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import getSight from "../../mob/race/sight"
import { Region } from "../../region/model/region"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import Service from "../../service/service"
import { MESSAGE_LOOK_CANNOT_SEE, NOT_FOUND } from "./constants"

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

export default function(request: Request, service: Service): Promise<Response> {
  const builder = request.respondWith()

  if (request.mob.getAffect(AffectType.Blind)) {
    return builder.fail(MESSAGE_LOOK_CANNOT_SEE)
  }

  if (request.getContextAsInput().subject) {
    return lookAtSubject(request, builder, service)
  }

  const room = request.getRoom()
  const ableToSee = isAbleToSee(request.mob, room.region)
  const roomDescription = ableToSee ? room.toString() : MESSAGE_LOOK_CANNOT_SEE
  const mobDescription = ableToSee ? reduceMobs(request.mob, service.getMobsByRoom(room)) : ""

  return builder.info(roomDescription
    + mobDescription
    + room.inventory.toString("is here."))
}

function isAbleToSee(mob: Mob, region: Region = null) {
  if (!region) {
    return true
  }

  return getSight(mob.race).isAbleToSee(12, region.terrain, region.weather)
}

function reduceMobs(mob: Mob, mobs: Mob[]): string {
  return mobs.filter(onlyLiving).reduce((previous: string, current: Mob) =>
    previous + (current !== mob ? `\n${current.name} is here.` : ""), "")
}

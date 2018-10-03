import { AffectType } from "../../affect/affectType"
import Maybe from "../../functional/maybe"
import ItemTable from "../../item/itemTable"
import { onlyLiving } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import getSight from "../../mob/race/sight"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import Service from "../../service/service"
import { MESSAGE_LOOK_CANNOT_SEE, NOT_FOUND } from "./constants"

function lookAtSubject(request: Request, builder: ResponseBuilder, itemTable: ItemTable) {
  const mob = request.findMobInRoom()
  if (mob) {
    return builder.info(mob.description)
  }

  let item = itemTable.findItemByInventory(request.getRoom().inventory, request.subject)
  if (item) {
    return builder.info(item.describe())
  }

  item = itemTable.findItemByInventory(request.mob.inventory, request.subject)
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

  if (request.subject) {
    return lookAtSubject(request, builder, service.itemTable)
  }

  const room = request.getRoom()
  const roomDescription = new Maybe(room.region)
    .do((region) =>
      getSight(request.mob.race).isAbleToSee(12, region.terrain, region.weather)
        ? room.toString() : MESSAGE_LOOK_CANNOT_SEE)
    .or(() => room.toString())
    .get()

  return builder.info(roomDescription
    + room.mobs.filter(onlyLiving).reduce((previous: string, current: Mob) =>
        previous + (current !== request.mob ? `\n${current.name} is here.` : ""), "")
    + room.inventory.toString("is here.")
    + `
${request.getPrompt()}`)
}

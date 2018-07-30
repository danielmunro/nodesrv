import { Item } from "../../item/model/item"
import { Disposition } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import { getMob } from "../../mob/table"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export const NOT_FOUND = "You don't see that anywhere."

function lookAtSubject(request, builder) {
  const mob = request.findMobInRoom()
  if (mob) {
    return builder.info(mob.description)
  }

  let item = request.findItemInRoomInventory()
  if (item) {
    return builder.info(item.description)
  }

  item = request.findItemInSessionMobInventory()
  if (item) {
    return builder.info(item.description)
  }

  return builder.error(NOT_FOUND)
}

export default function(request: Request): Promise<Response> {
  const builder = new ResponseBuilder(request)
  if (request.subject) {
    return lookAtSubject(request, builder)
  }

  const room = request.getRoom()
  const mobs = room.mobs.map((mob) => getMob(mob.id)).filter((mob) => mob.disposition !== Disposition.Dead)

  return builder.info(room.toString()
    + mobs.reduce((previous: string, current: Mob) =>
        previous + (current !== request.mob ? `\n${current.name} is here.` : ""), "")
    + room.inventory.items.reduce((previous: string, current: Item) =>
`${previous}
${current.name} is here.`, "")
    + `
${request.getPrompt()}`)
}

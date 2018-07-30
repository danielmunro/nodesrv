import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { Disposition } from "../../mob/disposition"
import { getMob } from "../../mob/table"

export const NOT_FOUND = "You don't see that anywhere."

export default function(request: Request): Promise<Response> {
  const builder = new ResponseBuilder(request)
  if (request.subject) {
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

import Response from "../../request/response"
import { Request } from "../../request/request"
import ResponseBuilder from "../../request/responseBuilder"

export default function(request: Request): Promise<Response> {
  const mob = request.mob
  const attr = mob.getCombinedAttributes()
  const stats = attr.stats
  return new ResponseBuilder(request).info(`
You are ${mob.name}, level ${mob.level} with ${mob.experience} experience points.
A ${mob.race} ${mob.specialization}.
Your attributes: ${stats.str} str, ${stats.int} int, ${stats.wis} wis, ${stats.dex} dex, ${stats.con} con, ${stats.sta} sta
You have ${mob.gold} gold.
`)
}
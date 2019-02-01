import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"

export default class ScoreAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const attr = mob.getCombinedAttributes()
    const stats = attr.stats
    return checkedRequest.respondWith().info(`
You are ${mob.name}, level ${mob.level} with ${mob.playerMob.experience} experience points.
A ${mob.race} ${mob.specialization}.
Attributes: ${stats.str} str, ${stats.int} int, ${stats.wis} wis, ${stats.dex} dex, ${stats.con} con, ${stats.sta} sta
You have ${mob.gold} gold.
`)
  }

  protected getRequestType(): RequestType {
    return RequestType.Score
  }
}

import Check from "../../../check/check"
import {RequestType} from "../../../request/enum/requestType"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class ScoreAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const stats = mob.attribute().getStats()
    return requestService.respondWith().info(`
You are ${mob.name}, level ${mob.level} with ${mob.playerMob.experience} experience points.
A ${mob.raceType} ${mob.specializationType}.
Attributes: ${stats.str} str, ${stats.int} int, ${stats.wis} wis, ${stats.dex} dex, ${stats.con} con, ${stats.sta} sta
You have ${mob.gold} gold.
`)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Score
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

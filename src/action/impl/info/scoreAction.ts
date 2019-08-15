import {injectable} from "inversify"
import Check from "../../../check/check"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class ScoreAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  /* tslint:disable */
  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const attributes = mob.attribute().combine()
    return requestService.respondWith().info(`
You are ${mob.name}, level ${mob.level} with ${mob.playerMob.experience} experience points.
A ${mob.raceType} ${mob.specializationType}.
Attributes: ${attributes.str} str, ${attributes.int} int, ${attributes.wis} wis, ${attributes.dex} dex, ${attributes.con} con, ${attributes.sta} sta
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

import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class ScoreAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Score)
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
}

import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class AfkAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Afk)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const player = requestService.getMob().player
    player.isAfk = !player.isAfk
    return requestService.respondWith().info("you are " + (player.isAfk ? "AFK" : "back"))
  }
}

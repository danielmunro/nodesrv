import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class EquippedAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Equipped)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().info("You are wearing:\n" +
      requestService.getEquipped().map(
        item => item.equipment + " -- " + item.brief).join("\n"))
  }
}

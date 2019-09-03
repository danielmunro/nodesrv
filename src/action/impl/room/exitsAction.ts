import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class ExitsAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Exits)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().success(
      "Your exits: " + requestService.getRoomExits().map(exit => exit.direction).join(", "))
  }
}

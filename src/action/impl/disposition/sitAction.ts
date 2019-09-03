import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {ConditionMessages, HelpMessages, Messages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class SitAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Sit, HelpMessages.ChangeDisposition)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireDisposition(Disposition.Sitting, ConditionMessages.Sit.AlreadySitting)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService
      .setMobDisposition(Disposition.Sitting)
      .respondWith()
      .okWithMessage(requestService.createResponseMessage(Messages.Sitting.Success)
        .setVerbToRequestCreator("sit")
        .setVerbToTarget("sit")
        .setVerbToObservers("sits"))
  }
}

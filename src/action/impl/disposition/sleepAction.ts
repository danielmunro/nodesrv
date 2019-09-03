import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {HelpMessages, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class SleepAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Sleep, HelpMessages.ChangeDisposition)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireDisposition(Disposition.Sleeping, ConditionMessages.Sleep.AlreadySleeping)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService
      .setMobDisposition(Disposition.Sleeping)
      .respondWith()
      .okWithMessage(requestService.createResponseMessage(Messages.Sleep.Success)
        .setVerbToRequestCreator("lay")
        .addReplacementForRequestCreator("verb2", "go")
        .setVerbToTarget("lay")
        .addReplacementForTarget("verb2", "go")
        .setVerbToObservers("lays")
        .addReplacementForObservers("verb2", "goes"))
  }
}

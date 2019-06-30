import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {ConditionMessages, HelpMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class SitAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
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

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Sit
  }

  public getHelpText(): string {
    return HelpMessages.ChangeDisposition
  }
}

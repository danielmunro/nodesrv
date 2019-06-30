import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {HelpMessages, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class SleepAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
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

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Sleep
  }

  public getHelpText(): string {
    return HelpMessages.ChangeDisposition
  }
}

import {AffectType} from "../../../affect/enum/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {HelpMessages, Messages} from "../../constants"
import {MESSAGE_FAIL_ALREADY_AWAKE} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class WakeAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireDisposition(Disposition.Standing, MESSAGE_FAIL_ALREADY_AWAKE)
      .not().requireAffect(AffectType.Sleep, Messages.Wake.CannotWakeUp)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService
      .setMobDisposition(Disposition.Standing)
      .respondWith()
      .okWithMessage(requestService.createResponseMessage(Messages.Wake.Success)
        .setVerbToRequestCreator("wake")
        .addReplacementForRequestCreator("verb2", "stand")
        .setVerbToTarget("wake")
        .addReplacementForTarget("verb2", "stand")
        .setVerbToObservers("wakes")
        .addReplacementForObservers("verb2", "stands"))
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Wake
  }

  public getHelpText(): string {
    return HelpMessages.ChangeDisposition
  }
}

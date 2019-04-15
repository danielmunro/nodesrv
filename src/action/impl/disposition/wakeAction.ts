import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {Disposition} from "../../../mob/enum/disposition"
import Request from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {HelpMessages, Messages} from "../../constants"
import {MESSAGE_FAIL_ALREADY_AWAKE} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class WakeAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireDisposition(Disposition.Standing, MESSAGE_FAIL_ALREADY_AWAKE)
      .capture(request.mob)
      .not().requireAffect(AffectType.Sleep, Messages.Wake.CannotWakeUp)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    checkedRequest.request.mob.disposition = Disposition.Standing
    return checkedRequest.respondWith().success(Messages.Wake.Success)
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

import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {Disposition} from "../../../mob/enum/disposition"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"

export default class SleepAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireDisposition(Disposition.Sleeping, ConditionMessages.Sleep.AlreadySleeping)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    checkedRequest.request.mob.disposition = Disposition.Sleeping
    return checkedRequest.respondWith().success(Messages.Sleep.Success)
  }

  protected getRequestType(): RequestType {
    return RequestType.Sleep
  }
}
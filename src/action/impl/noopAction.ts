import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import {MESSAGE_NOT_UNDERSTOOD} from "../../client/constants"
import { Request } from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Action from "../action"

export default class NoopAction extends Action {
  public check(request: Request): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().error(MESSAGE_NOT_UNDERSTOOD)
  }

  protected getRequestType(): RequestType {
    return RequestType.Noop
  }
}

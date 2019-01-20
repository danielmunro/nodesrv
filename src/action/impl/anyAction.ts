import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import { Request } from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Action from "../action"

export default class AnyAction extends Action {
  public check(request: Request): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().success()
  }

  protected getRequestType(): RequestType {
    return RequestType.Any
  }
}

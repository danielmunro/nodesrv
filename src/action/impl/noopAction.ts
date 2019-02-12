import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import {MESSAGE_NOT_UNDERSTOOD} from "../../client/constants"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Action from "../action"
import {ActionPart} from "../enum/actionPart"

export default class NoopAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().error(MESSAGE_NOT_UNDERSTOOD)
  }

  public getActionParts(): ActionPart[] {
    return []
  }

  protected getRequestType(): RequestType {
    return RequestType.Noop
  }
}

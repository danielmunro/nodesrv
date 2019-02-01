import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"

export default class ExitsAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().success(
      "Your exits: " + checkedRequest.request.room.exits.map(exit => exit.direction).join(", "))
  }

  protected getRequestType(): RequestType {
    return RequestType.Exits
  }
}

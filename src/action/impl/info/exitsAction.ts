import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class ExitsAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().success(
      "Your exits: " + checkedRequest.request.room.exits.map(exit => exit.direction).join(", "))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Exits
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

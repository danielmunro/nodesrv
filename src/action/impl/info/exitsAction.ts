import Check from "../../../check/check"
import {RequestType} from "../../../request/enum/requestType"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class ExitsAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().success(
      "Your exits: " + requestService.getRoomExits().map(exit => exit.direction).join(", "))
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Exits
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

import {injectable} from "inversify"
import Check from "../../../check/check"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
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

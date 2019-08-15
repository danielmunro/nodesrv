import {injectable} from "inversify"
import Check from "../../check/check"
import {MESSAGE_NOT_UNDERSTOOD} from "../../client/constants"
import {RequestType} from "../../messageExchange/enum/requestType"
import Response from "../../messageExchange/response"
import RequestService from "../../messageExchange/service/requestService"
import {Messages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Action from "./action"

@injectable()
export default class NoopAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().error(MESSAGE_NOT_UNDERSTOOD)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return []
  }

  public getRequestType(): RequestType {
    return RequestType.Noop
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

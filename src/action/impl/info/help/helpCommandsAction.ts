import { injectable } from "inversify"
import Check from "../../../../check/check"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import AllCommandsAction from "../../allCommandsAction"

@injectable()
export default class HelpCommandsAction extends AllCommandsAction {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.HelpCommands
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().info(
      this.actions.sort((a, b) => a.getRequestType() < b.getRequestType() ? -1 : 1)
        .reduce((previous: string, current) =>
          previous + current.getRequestType() + "\n", "Commands:\n"))
  }

}

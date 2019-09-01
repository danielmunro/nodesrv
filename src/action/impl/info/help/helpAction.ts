import {injectable} from "inversify"
import "reflect-metadata"
import Check from "../../../../check/check"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Request from "../../../../messageExchange/request"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import Maybe from "../../../../support/functional/maybe/maybe"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import Action from "../../action"
import AllCommandsAction from "../../allCommandsAction"

@injectable()
export default class HelpAction extends AllCommandsAction {
  public async check(request: Request): Promise<Check> {
    return new Maybe<Check>(this.actions.find(
      (a: Action) => a.isAbleToHandleRequestType(request.getSubject() as RequestType)))
      .do(action => Check.ok(action))
      .or(() => Check.fail(Messages.Help.Fail))
      .get()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const action = requestService.getResult<Action>()
    const actionParts = action.getActionParts()
    actionParts.shift()
    const parts = actionParts.map((actionPart: ActionPart) => "{" + actionPart + "}").join(" ")
    return requestService.respondWith().success(
`Help:
command: ${action.getRequestType()}
syntax: ${action.getRequestType()}${parts ? " " + parts : ""}
${action.getHelpText()}`)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Help
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

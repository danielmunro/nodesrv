import Check from "../../../check/check"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class HelpAction extends Action {
  private actions: Action[]

  public setActions(actions: Action[]) {
    this.actions = actions
  }
  public check(request: Request): Promise<Check> {
    const action = this.actions.find(
      (a: Action) => a.isAbleToHandleRequestType(request.getSubject() as RequestType))
    if (!action) {
      return Check.fail(Messages.Help.Fail)
    }
    return Check.ok(action)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const action = requestService.getResult() as Action
    const actionParts = action.getActionParts()
    actionParts.shift()
    return requestService.respondWith().success(
`syntax: ${action.getRequestType()} ${actionParts.map(
        (actionPart: ActionPart) => "{" + actionPart + "}").join(" ")}

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

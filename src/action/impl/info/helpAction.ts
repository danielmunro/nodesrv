import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {Request} from "../../../request/request"
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

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const action = checkedRequest.check.result as Action
    const actionParts = action.getActionParts()
    actionParts.shift()
    return checkedRequest.respondWith().success(
      `syntax: ${action.getRequestType()} ${actionParts.map(
        (actionPart: ActionPart) => "{" + actionPart + "}").join(" ")}`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Help
  }
}

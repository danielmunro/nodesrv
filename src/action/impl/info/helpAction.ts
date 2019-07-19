import Check from "../../../check/check"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import Maybe from "../../../support/functional/maybe/maybe"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class HelpAction extends Action {
  private actions: Action[]

  public setActions(actions: Action[]) {
    this.actions = actions
  }
  public check(request: Request): Promise<Check> {
    return new Maybe<any>(this.actions.find(
      (a: Action) => a.isAbleToHandleRequestType(request.getSubject() as RequestType)))
      .do(action => Check.ok(action))
      .or(() => Check.fail(Messages.Help.Fail))
      .get()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const action = requestService.getResult() as Action
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

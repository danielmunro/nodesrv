import Check from "../../check/check"
import {CheckType} from "../../check/enum/checkType"
import Request from "../../request/request"
import RequestService from "../../request/requestService"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Action from "../action"
import {Messages} from "../constants"
import {ActionPart} from "../enum/actionPart"

export default class MultiAction extends Action {
  constructor(
    private readonly requestType: RequestType,
    private readonly failMessage: string,
    private readonly actionParts: ActionPart[],
    private readonly actions: Action[]) {
    super()
  }

  public async check(request: Request): Promise<Check> {
    for (const action of this.actions) {
      const check = await action.check(request)
      if (check.getCheckTypeResult(CheckType.HasTarget)) {
        return Check.ok(action)
      }
    }
    return Check.fail(this.failMessage)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const action: Action = requestService.getResult()
    return action.handle(requestService.getRequest())
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return this.actionParts
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return this.requestType
  }
}

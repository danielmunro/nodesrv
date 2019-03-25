import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import {Request} from "../../request/request"
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

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const action: Action = checkedRequest.check.result
    return action.handle(checkedRequest.request)
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

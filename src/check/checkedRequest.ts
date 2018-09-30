import { ActionOutcome } from "../action/actionOutcome"
import Maybe from "../functional/maybe"
import { Mob } from "../mob/model/mob"
import { Request } from "../request/request"
import ResponseAction from "../request/responseAction"
import ResponseBuilder from "../request/responseBuilder"
import Check from "./check"
import { CheckType } from "./checkType"

export default class CheckedRequest {
  public readonly mob: Mob

  constructor(
    public readonly request: Request,
    public readonly check: Check,
  ) {
    this.mob = request.mob
  }

  public getCheckTypeResult(checkType: CheckType) {
    return new Maybe(this.check.checkResults.find(r => r.checkType === checkType))
      .do(result => result.thing)
      .get()
  }

  public respondWith(actionOutcome: ActionOutcome = ActionOutcome.None,
                     thing: any = null): ResponseBuilder {
    return new ResponseBuilder(this, new ResponseAction(actionOutcome, thing))
  }
}

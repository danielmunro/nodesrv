import { ActionOutcome } from "../action/actionOutcome"
import Maybe from "../support/functional/maybe"
import { Mob } from "../mob/model/mob"
import { Request } from "../request/request"
import ResponseAction from "../request/responseAction"
import ResponseBuilder from "../request/responseBuilder"
import { Room } from "../room/model/room"
import Check from "./check"
import { CheckType } from "./checkType"

export default class CheckedRequest {
  private static getResult(thing) {
    if (typeof thing === "function") {
      return thing()
    }

    return thing
  }

  public readonly mob: Mob
  public readonly room: Room

  constructor(public readonly request: Request, public readonly check: Check) {
    this.mob = request.mob
    this.room = request.getRoom()
  }

  public getCheckTypeResult(checkType: CheckType) {
    return new Maybe(this.check.checkResults.find(r => r.checkType === checkType))
      .do(result => CheckedRequest.getResult(result.thing))
      .get()
  }

  public respondWith(actionOutcome: ActionOutcome = ActionOutcome.None,
                     thing: any = null): ResponseBuilder {
    return new ResponseBuilder(this, new ResponseAction(actionOutcome, thing))
  }
}

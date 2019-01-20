import {Affect} from "../../../affect/model/affect"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"

function reduceAffects(affects) {
  return affects.reduce((previous, current: Affect) =>
    previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"), "")
}

export default class AffectsAction extends Action {
  public check(request: Request): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith()
      .info("Your affects:\n" + reduceAffects(checkedRequest.mob.affects))
  }

  protected getRequestType(): RequestType {
    return RequestType.Affects
  }
}

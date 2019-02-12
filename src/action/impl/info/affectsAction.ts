import {Affect} from "../../../affect/model/affect"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {ActionPart} from "../../enum/actionPart"

function reduceAffects(affects: Affect[]) {
  return affects.reduce((previous: string, current: Affect) =>
    previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"), "")
}

export default class AffectsAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith()
      .info("Your affects:\n" + reduceAffects(checkedRequest.mob.affects))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Affects
  }
}

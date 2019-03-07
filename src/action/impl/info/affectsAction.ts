import {Affect} from "../../../affect/model/affect"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class AffectsAction extends Action {
  private static reduceAffects(affects: Affect[]) {
    return affects.reduce((previous: string, current: Affect) =>
      previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"), "")
  }

  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith()
      .info("Your affects:\n" + AffectsAction.reduceAffects(checkedRequest.mob.affects))
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Affects
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

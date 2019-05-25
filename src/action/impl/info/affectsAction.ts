import {Affect} from "../../../affect/model/affect"
import Check from "../../../check/check"
import {RequestType} from "../../../request/enum/requestType"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class AffectsAction extends Action {
  private static reduceAffects(affects: Affect[]) {
    return affects.reduce((previous: string, current: Affect) =>
      previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"), "")
  }

  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith()
      .info("Your affects:\n" + AffectsAction.reduceAffects(requestService.getAffects()))
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

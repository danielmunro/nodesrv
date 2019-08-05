import {injectable} from "inversify"
import Check from "../../../check/check"
import {RequestType} from "../../../request/enum/requestType"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class EquippedAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().info("You are wearing:\n" +
      requestService.getEquipped().map(
        item => item.equipment + " -- " + item.brief).join("\n"))
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Equipped
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

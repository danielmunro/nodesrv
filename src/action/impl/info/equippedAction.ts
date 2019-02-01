import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"

export default class EquippedAction extends Action {
  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().info("You are wearing:\n" +
      checkedRequest.mob.equipped.getItems().map(
        item => item.name).join("\n"))
  }

  protected getRequestType(): RequestType {
    return RequestType.Equipped
  }
}

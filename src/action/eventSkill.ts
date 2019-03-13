import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import {RequestType} from "../request/requestType"
import ResponseMessage from "../request/responseMessage"
import {Messages} from "./constants"
import {ActionPart} from "./enum/actionPart"
import {ActionType} from "./enum/actionType"
import Skill from "./skill"

export default abstract class EventSkill extends Skill {
  public getCosts(): Cost[] {
    return []
  }

  /* istanbul ignore next */
  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getActionParts(): ActionPart[] {
    return []
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Event.Failed)
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Event.Success)
  }

  public getRequestType(): RequestType {
    return RequestType.Noop
  }

  /* istanbul ignore next */
  public applySkill(): void {
    // nothing to do
  }
}

import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import {RequestType} from "../request/requestType"
import ResponseMessage from "../request/responseMessage"
import {ActionPart} from "./enum/actionPart"
import {ActionType} from "./enum/actionType"
import Skill from "./skill"

export default abstract class EventSkill extends Skill {
  public getCosts(): Cost[] {
    return []
  }

  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getActionParts(): ActionPart[] {
    return []
  }

  public getFailureMessage(): ResponseMessage {
    return undefined
  }

  public getSuccessMessage(): ResponseMessage {
    return undefined
  }

  public getRequestType(): RequestType {
    return RequestType.Noop
  }

  /* tslint:disable */
  public applySkill(checkedRequest: CheckedRequest): void {
  }
}

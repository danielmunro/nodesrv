import AbilityService from "../../../check/abilityService"
import CheckedRequest from "../../../check/checkedRequest"
import Cost from "../../../check/cost/cost"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {SkillType} from "../../../skill/skillType"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class WeaponAction extends Skill {
  constructor(
    abilityService: AbilityService,
    private readonly skillType: SkillType) {
    super(abilityService)
  }

  public roll(): boolean {
    return true
  }

  public applySkill(): void {
    //
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(checkedRequest.mob, "")
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(checkedRequest.mob, "")
  }

  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getCosts(): Cost[] {
    return []
  }

  public getSkillType(): SkillType {
    return this.skillType
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return []
  }

  public getRequestType(): RequestType {
    return RequestType.Noop
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

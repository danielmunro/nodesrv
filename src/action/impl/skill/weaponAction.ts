import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import Cost from "../../../check/cost/cost"
import EventService from "../../../event/eventService"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {SkillType} from "../../../skill/skillType"
import {ActionPart} from "../../enum/actionPart"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class WeaponAction extends Skill {
  constructor(
    checkBuilderFactory: CheckBuilderFactory,
    eventService: EventService,
    private readonly skillType: SkillType) {
    super(checkBuilderFactory, eventService)
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

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    return new SpecializationLevel(specializationType, 1)
  }

  public getCosts(): Cost[] {
    return []
  }

  public getSkillType(): SkillType {
    return this.skillType
  }

  public getActionParts(): ActionPart[] {
    return []
  }

  protected getRequestType(): RequestType {
    return RequestType.Noop
  }
}

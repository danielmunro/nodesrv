import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import Cost from "../../../check/cost/cost"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class WeaponAction extends Skill {
  constructor(checkBuilderFactory: CheckBuilderFactory, private readonly skillType: SkillType) {
    super(checkBuilderFactory)
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    return checkedRequest.respondWith().success()
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

  protected getRequestType(): RequestType {
    return RequestType.Noop
  }
}

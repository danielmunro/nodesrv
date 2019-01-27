import {AffectType} from "../affect/affectType"
import Check from "../check/check"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {SpecializationType} from "../mob/specialization/specializationType"
import {Request} from "../request/request"
import Response from "../request/response"
import ResponseMessage from "../request/responseMessage"
import {ResponseStatus} from "../request/responseStatus"
import {SkillType} from "../skill/skillType"
import Action from "./action"
import {ActionType} from "./enum/actionType"

export default abstract class Skill extends Action {
  constructor(protected readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    if (!this.roll(checkedRequest)) {
      return checkedRequest.responseWithMessage(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(checkedRequest))
    }

    this.applySkill(checkedRequest)

    return checkedRequest.responseWithMessage(
      ResponseStatus.Success,
      this.getSuccessMessage(checkedRequest))
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .create()
  }

  public getAffectType(): AffectType {
    return undefined
  }

  public abstract getSkillType(): SkillType
  public abstract getCosts(): Cost[]
  public abstract getActionType(): ActionType
  public abstract getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel
  public abstract applySkill(checkedRequest: CheckedRequest): void
  public abstract roll(checkedRequest: CheckedRequest): boolean
  public abstract getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage
  public abstract getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage
}

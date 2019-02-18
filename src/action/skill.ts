import {AffectType} from "../affect/affectType"
import Check from "../check/check"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import CheckedRequest from "../check/checkedRequest"
import {CheckType} from "../check/checkType"
import Cost from "../check/cost/cost"
import EventService from "../event/eventService"
import {Mob} from "../mob/model/mob"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {SpecializationType} from "../mob/specialization/specializationType"
import roll from "../random/dice"
import {Request} from "../request/request"
import Response from "../request/response"
import ResponseMessage from "../request/responseMessage"
import {ResponseStatus} from "../request/responseStatus"
import {Skill as SkillModel} from "../skill/model/skill"
import SkillEvent from "../skill/skillEvent"
import {SkillType} from "../skill/skillType"
import Action from "./action"
import {ActionType} from "./enum/actionType"

export default abstract class Skill extends Action {
  constructor(
    protected readonly checkBuilderFactory: CheckBuilderFactory,
    protected readonly eventService: EventService) {
    super()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    if (!this.roll(checkedRequest)) {
      await this.eventService.publish(
        new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSkill), checkedRequest.mob, false))
      return checkedRequest.responseWithMessage(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(checkedRequest))
    }

    this.applySkill(checkedRequest)
    await this.eventService.publish(
      new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSkill), checkedRequest.mob, true))

    return checkedRequest.responseWithMessage(
      ResponseStatus.Success,
      this.getSuccessMessage(checkedRequest))
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .create()
  }

  public getAffectType(): AffectType | undefined {
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

  protected getSkillRoll(mob: Mob, skill: SkillModel): number {
    let amount = (skill.level * 2) / 3
    if (mob.getAffect(AffectType.Forget)) {
      amount -= roll(1, skill.level / 3)
    }
    return Math.min(100, Math.max(1, amount))
  }
}

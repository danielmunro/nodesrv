import {AffectType} from "../affect/affectType"
import AbilityService from "../check/abilityService"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import {CheckType} from "../check/checkType"
import Cost from "../check/cost/cost"
import {Mob} from "../mob/model/mob"
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
    protected readonly abilityService: AbilityService) {
    super()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const rollResult = this.roll(checkedRequest)
    await this.publishSkillEventFromCheckedRequest(checkedRequest, rollResult)
    if (!rollResult) {
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
    return this.abilityService.createCheckTemplate(request)
      .perform(this)
      .requireFromActionParts(request, this.getActionParts())
      .create()
  }

  public getAffectType(): AffectType | undefined {
    return undefined
  }

  public abstract getSkillType(): SkillType
  public abstract getCosts(): Cost[]
  public abstract getActionType(): ActionType
  public abstract applySkill(checkedRequest: CheckedRequest): void
  public abstract roll(checkedRequest: CheckedRequest): boolean
  public abstract getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage
  public abstract getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage

  protected getSkillRoll(mob: Mob, skill: SkillModel): number {
    let amount = (skill.level * 2) / 3
    if (mob.getAffect(AffectType.Forget)) {
      amount -= roll(4, 6)
    }
    const max = Math.min(100, Math.max(1, amount))
    return roll(1, max)
  }

  private publishSkillEventFromCheckedRequest(checkedRequest: CheckedRequest, rollResult: boolean) {
    return this.abilityService.publishEvent(
      new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSkill), checkedRequest.mob, rollResult))
  }
}

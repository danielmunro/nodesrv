import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {CheckMessages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {Costs, SkillMessages, Thresholds} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionPart} from "../../enum/actionPart"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class DirtKickAction extends Skill {
  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .create()
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    return roll(1, checkedRequest.mob.level) + roll(2, skill.level) > Thresholds.DirtKick
  }

  public applySkill(checkedRequest: CheckedRequest): void {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.addAffect(newAffect(AffectType.Blind, Math.max(1, checkedRequest.mob.level / 12)))
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      SkillMessages.DirtKick.Success,
      { verb: "kick", target: `${target.name}'s` },
      { verb: "kicks", target: "your" },
      { verb: "kicks", target: `${target.name}'s` })
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const mob = checkedRequest.mob
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      mob,
      SkillMessages.DirtKick.Fail,
      { requestCreator: "you", verb: "kick", verb2: "miss", target },
      { requestCreator: mob, verb: "kicks", verb2: "misses", target: "you" },
      { requestCreator: mob, verb: "kicks", verb2: "misses", target })
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior || specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Warrior, 3)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.DirtKick.Mv, CheckMessages.TooTired),
      new Cost(CostType.Delay, Costs.DirtKick.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.DirtKick
  }

  public getAffectType(): AffectType {
    return AffectType.Blind
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Target]
  }

  public getRequestType(): RequestType {
    return RequestType.DirtKick
  }
}

import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Fight} from "../../../mob/fight/fight"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {RequestType} from "../../../request/requestType"
import ResponseMessage from "../../../request/responseMessage"
import {ActionMessages, Costs, Thresholds} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class BackstabAction extends Skill {
  public applySkill(checkedRequest: CheckedRequest): void {
    const mob = checkedRequest.mob
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    Fight.oneHit(mob, target)
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const [ skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)
    return roll(3, skill.level / 3) +
      roll(2, Math.max(1, checkedRequest.mob.level - target.level)) > Thresholds.Backstab
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      checkedRequest.mob,
      ActionMessages.Backstab.Success,
      { target, verb: "backstab" },
      { verb: "backstabs" },
      { target, verb: "backstabs" })
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const mob = checkedRequest.mob
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    return new ResponseMessage(
      mob,
      ActionMessages.Backstab.Failure,
      { target, verb: "dodges", requestCreator: "your" },
      { verb: "dodge", requestCreator: `${mob.name}'s`},
      { target, verb: "dodges", requestCreator: `${mob.name}'s`})
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 1)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Backstab.Mv, ConditionMessages.Move.Fail.OutOfMovement),
      new Cost(CostType.Delay, Costs.Backstab.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Backstab
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Target]
  }

  public getRequestType(): RequestType {
    return RequestType.Backstab
  }
}

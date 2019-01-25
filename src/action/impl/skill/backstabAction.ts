import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Messages, Thresholds} from "../../../skill/action/constants"
import {Costs} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {SkillType} from "../../../skill/skillType"
import {ConditionMessages} from "../../constants"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class BackstabAction extends Skill {
  private static isSuccessfulBackstab(skill: SkillModel, mob: Mob, target: Mob): boolean {
    return roll(3, skill.level / 3) + roll(2, Math.max(1, mob.level - target.level))
      > Thresholds.Backstab
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const [ skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)

    if (!BackstabAction.isSuccessfulBackstab(skill, checkedRequest.mob, target)) {
      return checkedRequest.respondWith().fail(
        Messages.Backstab.Failure,
        { target, verb: "dodges", requestCreator: "your" },
        { verb: "dodge", requestCreator: `${checkedRequest.mob.name}'s`},
        { target, verb: "dodges", requestCreator: `${checkedRequest.mob.name}'s`})
    }

    return checkedRequest.respondWith().success(
      Messages.Backstab.Success,
      { target, verb: "backstab" },
      { verb: "backstabs" },
      { target, verb: "backstabs" })
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

  protected getRequestType(): RequestType {
    return RequestType.Backstab
  }
}

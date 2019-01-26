import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {Messages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Equipment} from "../../../item/equipment"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {ActionMessages} from "../../../skill/constants"
import {Costs, Thresholds} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {ConditionMessages as PreconditionMessages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class DisarmAction extends Skill {
  private static calculateDisarm(mob: Mob, target: Mob, skill: SkillModel): number {
    return roll(4, (Math.max(1, mob.level - target.level) + skill.level) / 2)
  }

  public async check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .perform(this)
      .require(
        (mob, target) => target.equipped.find(i => i.equipment === Equipment.Weapon),
        PreconditionMessages.Disarm.FailNothingToDisarm,
        CheckType.ItemPresent)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

    if (DisarmAction.calculateDisarm(checkedRequest.mob, target, skill) < Thresholds.Disarm) {
      return checkedRequest.respondWith().fail(
        ActionMessages.Disarm.Failure,
        { target, verb: "fail" },
        { target, verb: "fails" })
    }

    const item = checkedRequest.getCheckTypeResult(CheckType.ItemPresent)
    checkedRequest.room.inventory.addItem(item)

    return checkedRequest.respondWith().success(
      ActionMessages.Disarm.Success,
      { target, gender: target.gender, verb: "disarm" },
      { target, gender: target.gender, verb: "disarms" })
  }

  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 11)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 12)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Disarm.Mv, CheckMessages.TooTired),
      new Cost(CostType.Delay, Costs.Disarm.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Disarm
  }

  protected getRequestType(): RequestType {
    return RequestType.Disarm
  }
}

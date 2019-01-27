import {AffectType} from "../../../affect/affectType"
import CheckedRequest from "../../../check/checkedRequest"
import {Messages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Costs} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {CheckType} from "../../../check/checkType"
import {newAffect} from "../../../affect/factory"
import {Mob} from "../../../mob/model/mob"
import roll from "../../../random/dice"
import {ConditionMessages} from "../../constants"

export default class HamstringAction extends Skill {
  private static hamstringIsSuccessful(mob: Mob, skill: SkillModel, target: Mob) {
    return roll(1, skill.level) - target.level > mob.level
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const [skill, target ] = checkedRequest.results(CheckType.HasSkill, CheckType.HasTarget)
    if (!HamstringAction.hamstringIsSuccessful(checkedRequest.mob, skill, target)) {
      return checkedRequest.respondWith().fail(
        ConditionMessages.Hamstring.Fail,
        {verb: "attempt", target, verb2: "fail"},
        {verb: "attempts", target: "you", verb2: "fails"},
        {verb: "attempts", target, verb2: "fails"})
    }

    target.affects.push(newAffect(AffectType.Immobilize, checkedRequest.mob.level / 15))
    return checkedRequest.respondWith().success(
      ConditionMessages.Hamstring.Success,
      {verb: "slice", target: `${target}'s`, target2: "They"},
      {verb: "slices", target: "your", target2: "You"},
      {verb: "slices", target: `${target}'s`, target2: "They"})
  }

  public getActionType(): ActionType {
    return ActionType.SneakAttack
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 31)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Mv, Costs.Hamstring.Mv, CheckMessages.TooTired),
      new Cost(CostType.Mana, Costs.Hamstring.Mana, CheckMessages.NotEnoughMana),
      new Cost(CostType.Delay, Costs.Hamstring.Delay),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Hamstring
  }

  public getAffectType(): AffectType {
    return AffectType.Immobilize
  }

  protected getRequestType(): RequestType {
    return RequestType.Hamstring
  }
}

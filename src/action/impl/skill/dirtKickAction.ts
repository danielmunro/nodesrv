import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {Messages as CheckMessages} from "../../../check/constants"
import Cost from "../../../check/cost/cost"
import {CostType} from "../../../check/cost/costType"
import {Mob} from "../../../mob/model/mob"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../mob/specialization/specializationType"
import roll from "../../../random/dice"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Thresholds} from "../../../skill/constants"
import {Costs, Messages} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class DirtKickAction extends Skill {
  private static calculateDirtKickRoll(mob: Mob, skill: SkillModel): number {
    return roll(1, mob.level) + roll(2, skill.level)
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const responseBuilder = checkedRequest.respondWith()
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

    if (DirtKickAction.calculateDirtKickRoll(mob, skill) < Thresholds.DirtKick) {
      return responseBuilder.fail(Messages.DirtKick.Fail)
    }

    target.addAffect(newAffect(AffectType.Blind, Math.max(1, mob.level / 12)))

    return responseBuilder.success(Messages.DirtKick.Success)
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
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.DirtKick
  }

  public getAffectType(): AffectType {
    return AffectType.Blind
  }

  protected getRequestType(): RequestType {
    return RequestType.DirtKick
  }
}

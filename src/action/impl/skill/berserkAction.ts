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
import {Thresholds} from "../../../skill/action/constants"
import {Costs, Messages} from "../../../skill/constants"
import {Skill as SkillModel} from "../../../skill/model/skill"
import {SkillType} from "../../../skill/skillType"
import {ActionType} from "../../enum/actionType"
import Skill from "../../skill"

export default class BerserkAction extends Skill {
  private static calculateBerserkRoll(mob: Mob, skill: SkillModel): number {
    return roll(1, mob.level) + roll(2, skill.level)
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)

    if (BerserkAction.calculateBerserkRoll(mob, skill) < Thresholds.Berserk) {
      return checkedRequest.respondWith().fail(Messages.Berserk.Fail)
    }

    mob.addAffect(newAffect(AffectType.Berserk, mob.level / 10))

    return checkedRequest.respondWith().success(Messages.Berserk.Success)
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 1)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 15)
    }

    return new SpecializationLevel(SpecializationType.Noop, 1)
  }

  public getCosts(): Cost[] {
    return [
      new Cost(CostType.Delay, Costs.Berserk.Delay),
      new Cost(CostType.Mv, mob =>
        Math.max(mob.getCombinedAttributes().vitals.mv / 2, Costs.Berserk.Mv), CheckMessages.TooTired),
    ]
  }

  public getSkillType(): SkillType {
    return SkillType.Berserk
  }

  public getAffectType(): AffectType {
    return AffectType.Berserk
  }

  protected getRequestType(): RequestType {
    return RequestType.Berserk
  }
}

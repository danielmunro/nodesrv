import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {Mob} from "../../../../mob/model/mob"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import roll from "../../../../random/dice"
import {RequestType} from "../../../../request/requestType"
import Response from "../../../../request/response"
import {SuccessThreshold} from "../../../../skill/constants"
import {Skill as SkillModel} from "../../../../skill/model/skill"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../../skill"

export default class EnhancedDamageAction extends Skill {
  private static calculateEnhancedDamageRoll(mob: Mob, skill: SkillModel): number {
    const stats = mob.getCombinedAttributes().stats
    return roll(3, Math.max(1, stats.str / 6))
      + roll(3, Math.max(1, stats.sta / 10) + 1)
      + roll(4, Math.max(1, skill.level / 20) + 1)
      + 40
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)

    if (EnhancedDamageAction.calculateEnhancedDamageRoll(mob, skill) <= SuccessThreshold.EnhancedDamage) {
      return checkedRequest.respondWith().fail()
    }

    return checkedRequest.respondWith().success()
  }

  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 1)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 25)
    } else if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 30)
    }

    return new SpecializationLevel(SpecializationType.Cleric, 45)
  }

  public getCosts(): Cost[] {
    return []
  }

  public getSkillType(): SkillType {
    return SkillType.EnhancedDamage
  }

  public getActionParts(): ActionPart[] {
    return []
  }

  public getRequestType(): RequestType {
    return RequestType.Noop
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}

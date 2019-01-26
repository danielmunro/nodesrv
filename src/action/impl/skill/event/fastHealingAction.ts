import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import Cost from "../../../../check/cost/cost"
import {Mob} from "../../../../mob/model/mob"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import roll from "../../../../random/dice"
import {RequestType} from "../../../../request/requestType"
import Response from "../../../../request/response"
import {Thresholds} from "../../../../skill/constants"
import {Skill as SkillModel} from "../../../../skill/model/skill"
import {SkillType} from "../../../../skill/skillType"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../../skill"

export default class FastHealingAction extends Skill {
  private static fastHealingRoll(mob: Mob, skill: SkillModel) {
    return roll(2, mob.level + (skill.level / 2))
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const responseBuilder = checkedRequest.respondWith()

    if (FastHealingAction.fastHealingRoll(mob, skill) <= Thresholds.FastHealing) {
      return responseBuilder.fail()
    }

    mob.vitals.hp += roll( 10, mob.getCombinedAttributes().vitals.hp / 80)
    mob.normalizeVitals()

    return responseBuilder.success()
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 6)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 16)
    } else if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 15)
    }

    return new SpecializationLevel(SpecializationType.Cleric, 9)
  }

  public getCosts(): Cost[] {
    return []
  }

  public getSkillType(): SkillType {
    return SkillType.FastHealing
  }

  protected getRequestType(): RequestType {
    return RequestType.Noop
  }
}

import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import {percentRoll} from "../../../../random/dice"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import EventSkill from "../../../eventSkill"

export default class EnhancedDamageAction extends EventSkill {
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

  public getSkillType(): SkillType {
    return SkillType.EnhancedDamage
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const roll = this.getSkillRoll(checkedRequest.mob, skill)
    const percent = percentRoll()
    return Math.floor(roll) >= Math.ceil(percent)
  }
}

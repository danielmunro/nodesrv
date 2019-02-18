import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import roll from "../../../../random/dice"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import EventSkill from "../../../eventSkill"

export default class SecondAttackAction extends EventSkill {
  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 5)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 12)
    } else if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 30)
    }

    return new SpecializationLevel(SpecializationType.Cleric, 24)
  }

  public getSkillType(): SkillType {
    return SkillType.SecondAttack
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    return roll(1, skill.level) > mob.level
  }
}

import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import {Mob} from "../../../../mob/model/mob"
import SpecializationLevel from "../../../../mob/specialization/specializationLevel"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import roll from "../../../../random/dice"
import {Skill as SkillModel} from "../../../../skill/model/skill"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import EventSkill from "../../../eventSkill"

export default class DodgeAction extends EventSkill {
  private static calculateHitRoll(mob: Mob): number {
    const attrs = mob.getCombinedAttributes()
    return roll(1, attrs.stats.dex) + roll(1, attrs.hitroll.hit)
  }

  private static calculateDodgeRoll(mob: Mob, skill: SkillModel): number {
    return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level)
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel {
    if (specializationType === SpecializationType.Warrior) {
      return new SpecializationLevel(SpecializationType.Warrior, 13)
    } else if (specializationType === SpecializationType.Ranger) {
      return new SpecializationLevel(SpecializationType.Ranger, 1)
    } else if (specializationType === SpecializationType.Mage) {
      return new SpecializationLevel(SpecializationType.Mage, 20)
    }

    return new SpecializationLevel(SpecializationType.Cleric, 22)
  }

  public getSkillType(): SkillType {
    return SkillType.Dodge
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

    return DodgeAction.calculateDodgeRoll(mob, skill) <= DodgeAction.calculateHitRoll(target)
  }
}

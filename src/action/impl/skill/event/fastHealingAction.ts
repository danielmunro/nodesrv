import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import roll from "../../../../random/dice"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import EventSkill from "../../../eventSkill"

export default class FastHealingAction extends EventSkill {
  public applySkill(checkedRequest: CheckedRequest): void {
    const mob = checkedRequest.mob
    mob.vitals.hp += roll( 10, mob.getCombinedAttributes().vitals.hp / 80)
    mob.normalizeVitals()
  }

  public getActionType(): ActionType {
    return ActionType.Defensive
  }

  public getSkillType(): SkillType {
    return SkillType.FastHealing
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const mob = checkedRequest.mob
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    return roll(2, mob.level + (skill.level / 2)) > mob.level
  }
}

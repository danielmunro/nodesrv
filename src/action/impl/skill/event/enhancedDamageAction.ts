import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import {percentRoll} from "../../../../random/helpers"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import EventSkill from "../../../eventSkill"

export default class EnhancedDamageAction extends EventSkill {
  public getActionType(): ActionType {
    return ActionType.Neutral
  }

  public getSkillType(): SkillType {
    return SkillType.EnhancedDamage
  }

  /* istanbul ignore next */
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

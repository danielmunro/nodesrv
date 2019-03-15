import CheckedRequest from "../../../../check/checkedRequest"
import {CheckType} from "../../../../check/checkType"
import {percentRoll} from "../../../../random/helpers"
import {SkillType} from "../../../../skill/skillType"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import EventSkill from "../../../eventSkill"

export default class SecondAttackAction extends EventSkill {
  public getActionType(): ActionType {
    return ActionType.Offensive
  }

  public getSkillType(): SkillType {
    return SkillType.SecondAttack
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
    return percentRoll() < skill.level
  }
}

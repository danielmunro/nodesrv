import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import {percentRoll} from "../../../../support/random/helpers"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Dodge)
    .setRoll(checkedRequest => checkedRequest.getCheckTypeResult(CheckType.HasSkill).level / 2 > percentRoll())
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

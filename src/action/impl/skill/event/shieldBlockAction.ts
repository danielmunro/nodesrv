import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/enum/checkType"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import {percentRoll} from "../../../../support/random/helpers"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.ShieldBlock)
    .setRoll(requestService =>
      requestService.getResult(CheckType.HasSkill).level / 10 > percentRoll())
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

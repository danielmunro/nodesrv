import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../mob/skill/skillType"
import {percentRoll} from "../../../../support/random/helpers"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.FastHealing)
    .setRoll(requestService => requestService.getResult(CheckType.HasSkill).level / 2 > percentRoll())
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

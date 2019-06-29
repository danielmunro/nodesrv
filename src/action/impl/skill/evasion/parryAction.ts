import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {SkillType} from "../../../../mob/skill/skillType"
import {RequestType} from "../../../../request/enum/requestType"
import {percentRoll} from "../../../../support/random/helpers"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Parry)
    .setRoll(requestService =>
      requestService.getResult(CheckType.HasSkill).level / 10 > percentRoll())
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

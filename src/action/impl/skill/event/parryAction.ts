import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/enum/checkType"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import {percentRoll} from "../../../../support/random/helpers"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Parry)
    .setRoll(requestService =>
      requestService.getResult(CheckType.HasSkill).level / 10 > percentRoll())
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

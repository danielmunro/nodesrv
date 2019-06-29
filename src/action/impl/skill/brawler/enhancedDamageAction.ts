import AbilityService from "../../../../check/service/abilityService"
import {SkillType} from "../../../../mob/skill/skillType"
import {RequestType} from "../../../../request/enum/requestType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.EnhancedDamage)
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

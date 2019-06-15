import AbilityService from "../../../../check/service/abilityService"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Bludgeon)
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

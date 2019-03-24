import AbilityService from "../../../../check/abilityService"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.SecondAttack)
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

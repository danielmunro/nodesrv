import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import {SkillType} from "../../../../skill/skillType"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Endurance)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.Endurance)
    .create()
}

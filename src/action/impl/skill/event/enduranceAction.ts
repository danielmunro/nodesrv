import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import {SkillType} from "../../../../skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Endurance)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.Endurance)
    .create()
}

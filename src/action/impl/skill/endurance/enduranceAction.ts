import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/service/abilityService"
import {SkillMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Endurance)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.Endurance)
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.Endurance.Success)
        .setVerbToRequestCreator("feel")
        .setVerbToTarget("feel")
        .setVerbToObservers("looks")
        .create())
    .create()
}

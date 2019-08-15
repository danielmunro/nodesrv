import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {SkillEntity} from "../../../../mob/skill/entity/skillEntity"
import {SkillType} from "../../../../mob/skill/skillType"
import {percentRoll} from "../../../../support/random/helpers"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.ShieldBlock)
    .setRoll(requestService =>
      requestService.getResult<SkillEntity>(CheckType.HasSkill).level / 10 > percentRoll())
    .setRequestType(RequestType.Noop)
    .setActionType(ActionType.Defensive)
    .create()
}

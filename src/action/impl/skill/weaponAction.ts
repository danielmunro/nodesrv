import AbilityService from "../../../check/service/abilityService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {SkillType} from "../../../mob/skill/skillType"
import SkillBuilder from "../../builder/skillBuilder"

export default function(abilityService: AbilityService, skillType: SkillType) {
  return new SkillBuilder(abilityService, skillType)
    .setRoll(() => true)
    .setRequestType(RequestType.Noop)
    .create()
}

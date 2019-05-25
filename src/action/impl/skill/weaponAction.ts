import AbilityService from "../../../check/service/abilityService"
import {RequestType} from "../../../request/enum/requestType"
import {SkillType} from "../../../skill/skillType"
import SkillBuilder from "../../builder/skillBuilder"

export default function(abilityService: AbilityService, skillType: SkillType) {
  return new SkillBuilder(abilityService, skillType)
    .setRoll(() => true)
    .setRequestType(RequestType.Noop)
    .create()
}

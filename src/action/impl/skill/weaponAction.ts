import AbilityService from "../../../check/abilityService"
import {RequestType} from "../../../request/requestType"
import {SkillType} from "../../../skill/skillType"
import SkillBuilder from "../../skillBuilder"
import Skill from "../skill"

export default function(abilityService: AbilityService, skillType: SkillType) {
  return new SkillBuilder(abilityService, skillType)
    .setRoll(() => true)
    .setRequestType(RequestType.Noop)
    .create()
}

import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {Costs, SkillMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.DirtKick)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Blind)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setCosts([
      new MvCost(Costs.DirtKick.Mv),
      new DelayCost(Costs.DirtKick.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) =>
      createApplyAbilityResponse(affectBuilder
        .setTimeout(Math.max(1, requestService.getMobLevel() / 12, 5))
        .build()))
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.DirtKick.Success)
        .setVerbToRequestCreator("kick")
        .setVerbToTarget("kicks")
        .setPluralizeTarget()
        .setTargetPossessive()
        .setVerbToObservers("kicks")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.DirtKick.Fail)
        .setVerbToRequestCreator("kick")
        .addReplacementForRequestCreator("verb2", "miss")
        .setVerbToTarget("kicks")
        .addReplacementForRequestCreator("verb2", "misses")
        .setVerbToObservers("kicks")
        .addReplacementForRequestCreator("verb2", "miss")
        .create())
    .create()
}

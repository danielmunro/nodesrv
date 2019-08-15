import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import ResponseMessage from "../../../../messageExchange/responseMessage"
import {Costs, SkillMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Berserk)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.Berserk)
    .setCosts([
      new MvCost(Costs.Berserk.Mv),
      new DelayCost(Costs.Berserk.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) =>
      createApplyAbilityResponse(affectBuilder
        .setLevel(requestService.getMobLevel())
        .setTimeout(Math.min(1, requestService.getMobLevel() / 10))
        .build()))
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.Berserk.Success)
        .addReplacementForRequestCreator("requestCreator2", "you")
        .setSelfIdentifier("your")
        .setPluralizeRequestCreator()
        .addReplacementForTarget("requestCreator2", "they")
        .addReplacementForObservers("requestCreator2", "they")
        .create())
    .setFailMessage(requestService =>
      new ResponseMessage(
        requestService.getMob(),
        SkillMessages.Berserk.Fail)
        .onlySendToRequestCreator())
    .create()
}

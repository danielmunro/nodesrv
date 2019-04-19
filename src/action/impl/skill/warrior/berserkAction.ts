import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
import {Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
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
      Promise.resolve(affectBuilder
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

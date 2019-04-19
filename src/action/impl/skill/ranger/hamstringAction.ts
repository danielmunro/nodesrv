import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
import {Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ConditionMessages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Hamstring)
    .setActionType(ActionType.SneakAttack)
    .setAffectType(AffectType.Immobilize)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Hamstring.Mv),
      new ManaCost(Costs.Hamstring.Mana),
      new DelayCost(Costs.Hamstring.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(Math.max(1, requestService.getMobLevel() / 15))
      .build())
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ConditionMessages.Hamstring.Success)
        .setVerbToRequestCreator("slice")
        .addReplacementForRequestCreator("target2", "They")
        .setVerbToTarget("slices")
        .addReplacementForTarget("target2", "You")
        .setTargetPossessive()
        .setPluralizeTarget()
        .setVerbToObservers("slices")
        .addReplacementForObservers("target2", "They")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ConditionMessages.Hamstring.Fail)
        .setVerbToRequestCreator("attempt")
        .addReplacementForRequestCreator("verb2", "fail")
        .setVerbToTarget("attempts")
        .addReplacementForTarget("verb2", "fails")
        .setVerbToObservers("attempts")
        .addReplacementForObservers("verb2", "fails")
        .create())
    .create()
}

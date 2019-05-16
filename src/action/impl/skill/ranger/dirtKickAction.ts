import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
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
      affectBuilder
        .setTimeout(Math.max(1, requestService.getMobLevel() / 12, 5))
        .build())
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

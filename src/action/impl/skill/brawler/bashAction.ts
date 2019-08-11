import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {Costs, SkillMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Bash)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Stunned)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Bash.Mv),
      new DelayCost(Costs.Bash.Delay),
    ])
    .setApplySkill(async (_, affectBuilder) => {
      affectBuilder.setTimeout(1).build()
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.Bash.Success)
        .setVerbToRequestCreator("slam")
        .addReplacementForRequestCreator("verb2", "send")
        .addReplacementForRequestCreator("target2", "them")
        .setVerbToTarget("slams")
        .addReplacementForTarget("verb2", "sends")
        .addReplacementForTarget("target2", "you")
        .setVerbToObservers("slams")
        .addReplacementForObservers("verb2", "sends")
        .addReplacementForObservers("target2", "them")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.Bash.Fail)
        .setVerbToRequestCreator("fall")
        .addReplacementForRequestCreator("requestCreator2", "your")
        .setVerbToTarget("falls")
        .addReplacementForTarget("requestCreator2", "their")
        .setVerbToObservers("falls")
        .addReplacementForObservers("requestCreator2", "their")
        .create())
    .create()
}

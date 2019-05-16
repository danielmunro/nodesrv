import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AttackEvent from "../../../../mob/event/attackEvent"
import {Fight} from "../../../../mob/fight/fight"
import {Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.EyeGouge)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Blind)
    .setActionParts([ ActionPart.Action, ActionPart.MobInRoom ])
    .setCosts([
      new MvCost(Costs.EyeGouge.Mv),
      new DelayCost(Costs.EyeGouge.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) => {
      const level = requestService.getMobLevel()
      const target = requestService.getTarget()
      target.vitals.hp -= Fight.calculateDamageForOneHit(requestService.getMob(), target)
      await abilityService.publishEvent(new AttackEvent(requestService.getMob(), target))
      return affectBuilder
        .setTimeout(level / 12)
        .setLevel(level)
        .build()
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.EyeGouge.Success)
      .setVerbToRequestCreator("swipe")
      .setVerbToTarget("swipes")
      .setPluralizeTarget()
      .setTargetPossessive()
      .setVerbToObservers("swipes")
      .addReplacementForRequestCreator("requestCreator2", "your")
      .addReplacementForRequestCreator("target2", "their")
      .addReplacementForTarget("requestCreator2", "their")
      .addReplacementForTarget("target2", "your")
      .addReplacementForObservers("requestCreator2", "their")
      .addReplacementForObservers("target2", "their")
      .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.EyeGouge.Fail)
        .setVerbToRequestCreator("swipe")
        .setVerbToTarget("swipes")
        .setVerbToObservers("swipes")
        .addReplacementForRequestCreator("verb2", "miss")
        .addReplacementForTarget("verb2", "misses")
        .addReplacementForObservers("verb2", "misses")
        .create())
    .create()
}
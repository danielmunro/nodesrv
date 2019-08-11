import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {createAttackEvent} from "../../../../event/factory/eventFactory"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {Fight} from "../../../../mob/fight/fight"
import {Costs, SkillMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
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
      const target = requestService.getTarget<MobEntity>()
      target.hp -= Fight.calculateDamageForOneHit(requestService.getMob(), target)
      await abilityService.publishEvent(createAttackEvent(requestService.getMob(), target))
      return createApplyAbilityResponse(affectBuilder
        .setTimeout(level / 12)
        .setLevel(level)
        .build())
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

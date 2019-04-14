import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AttackEvent from "../../../../mob/event/attackEvent"
import {Fight} from "../../../../mob/fight/fight"
import ResponseMessage from "../../../../request/responseMessage"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
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
    .setApplySkill(async (checkedRequest, affectBuilder) => {
      const level = checkedRequest.mob.level
      const target = checkedRequest.getTarget()
      target.vitals.hp -= Fight.calculateDamageForOneHit(checkedRequest.mob, target)
      await abilityService.publishEvent(new AttackEvent(checkedRequest.mob, target))
      return affectBuilder
        .setTimeout(level / 12)
        .setLevel(level)
        .build()
    })
    .setSuccessMessage(checkedRequest => new ResponseMessageBuilder(
        checkedRequest.mob,
        SkillMessages.EyeGouge.Success,
        checkedRequest.getTarget())
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
    .setFailMessage(checkedRequest => new ResponseMessageBuilder(
      checkedRequest.mob,
      SkillMessages.EyeGouge.Fail,
      checkedRequest.getTarget())
      .create())
    .create()
}

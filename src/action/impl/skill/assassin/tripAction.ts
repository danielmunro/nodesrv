import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {ActionMessages, Costs} from "../../../../mob/skill/constants"
import {SkillEntity} from "../../../../mob/skill/entity/skillEntity"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Trip)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Stunned)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setAffectType(AffectType.Stunned)
    .setCosts([
      new MvCost(Costs.Trip.Mv),
      new DelayCost(Costs.Trip.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) => {
      const target = requestService.getResult<MobEntity>(CheckType.HasTarget)
      const skill = requestService.getResult<SkillEntity>(CheckType.HasSkill)
      const amount = skill.level / 10
      target.hp -= amount
      return createApplyAbilityResponse(affectBuilder
        .setTimeout(amount)
        .build())
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Trip.Success)
        .setVerbToRequestCreator("trip")
        .setVerbToTarget("trips")
        .setVerbToObservers("trips")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Trip.Failure)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fails")
        .setVerbToObservers("fails")
        .create())
    .create()
}

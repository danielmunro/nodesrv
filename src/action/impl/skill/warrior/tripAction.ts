import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {CheckType} from "../../../../check/enum/checkType"
import {ActionMessages, Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
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
      const [ target, skill ] = requestService.getResults(CheckType.HasTarget, CheckType.HasSkill)
      const amount = skill.level / 10
      target.vitals.hp -= amount
      return affectBuilder
        .setTimeout(amount)
        .build()
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

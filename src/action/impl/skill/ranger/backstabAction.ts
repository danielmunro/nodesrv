import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Fight} from "../../../../mob/fight/fight"
import {ActionMessages, Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Backstab)
    .setActionType(ActionType.Offensive)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Backstab.Mv),
      new DelayCost(Costs.Backstab.Delay),
    ])
    .setApplySkill(async requestService => {
      const target = requestService.getTarget()
      target.vitals.hp -= Fight.calculateDamageForOneHit(requestService.getMob(), target)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Backstab.Success)
      .setVerbToRequestCreator("backstab")
      .setVerbToTarget("backstabs")
      .setVerbToObservers("backstabs")
      .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Backstab.Failure)
      .setPluralizeRequestCreator()
      .setVerbToRequestCreator("dodges")
      .setVerbToTarget("dodge")
      .setSelfIdentifier("your")
      .create())
    .create()
}

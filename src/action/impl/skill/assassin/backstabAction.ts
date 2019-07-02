import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {Fight} from "../../../../mob/fight/fight"
import {ActionMessages, Costs} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
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
      const target = requestService.getTarget() as MobEntity
      target.hp -= Fight.calculateDamageForOneHit(requestService.getMob(), target)
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

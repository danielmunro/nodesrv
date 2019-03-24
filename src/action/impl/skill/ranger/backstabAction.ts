import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Fight} from "../../../../mob/fight/fight"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
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
    .setCosts([
      new MvCost(Costs.Backstab.Mv),
      new DelayCost(Costs.Backstab.Delay),
    ])
    .setApplySkill(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      target.vitals.hp -= Fight.calculateDamageForOneHit(checkedRequest.mob, target)
    })
    .setSuccessMessage(checkedRequest => new ResponseMessageBuilder(
      checkedRequest.mob,
      ActionMessages.Backstab.Success)
      .setTarget(checkedRequest.getCheckTypeResult(CheckType.HasTarget))
      .setPluralizeRequestCreator(false)
      .setVerbToRequestCreator("backstab")
      .setVerbToTarget("backstabs")
      .setVerbToObservers("backstabs")
      .create())
    .setFailMessage(checkedRequest => new ResponseMessageBuilder(
      checkedRequest.mob,
      ActionMessages.Backstab.Failure)
      .setTarget(checkedRequest.getCheckTypeResult(CheckType.HasTarget))
      .setVerbToRequestCreator("dodges")
      .setVerbToTarget("dodge")
      .setSelfIdentifier("your")
      .create())
    .create()
}

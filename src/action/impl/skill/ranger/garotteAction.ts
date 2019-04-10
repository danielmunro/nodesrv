import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {Disposition} from "../../../../mob/enum/disposition"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
import {Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ConditionMessages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Garotte)
    .setActionType(ActionType.SneakAttack)
    .setAffectType(AffectType.Sleep)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Garotte.Mv),
      new ManaCost(Costs.Garotte.Mana),
      new DelayCost(Costs.Garotte.Delay),
    ])
    .setApplySkill(async (checkedRequest, affectBuilder) => {
      checkedRequest.getTarget().disposition = Disposition.Sleeping
      return affectBuilder
        .setTimeout(Math.max(1, checkedRequest.mob.level / 12))
        .build()
      })
    .setSuccessMessage(checkedRequest =>
      new ResponseMessageBuilder(
        checkedRequest.mob,
        ConditionMessages.Garotte.Success,
        checkedRequest.getTarget())
        .setVerbToRequestCreator("passes")
        .setVerbToTarget("pass")
        .setVerbToObservers("passes")
        .create())
    .setFailMessage(checkedRequest =>
      new ResponseMessageBuilder(
        checkedRequest.mob,
        ConditionMessages.Garotte.Fail,
        checkedRequest.getTarget())
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fails")
        .setVerbToObservers("fails")
        .create())
    .create()
}

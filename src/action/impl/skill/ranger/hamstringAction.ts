import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
import {Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ConditionMessages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Hamstring)
    .setActionType(ActionType.SneakAttack)
    .setAffectType(AffectType.Immobilize)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Hamstring.Mv),
      new ManaCost(Costs.Hamstring.Mana),
      new DelayCost(Costs.Hamstring.Delay),
    ])
    .setApplySkill(async (checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(Math.max(1, checkedRequest.mob.level / 15))
      .build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ConditionMessages.Hamstring.Success,
        {verb: "slice", target: `${target}'s`, target2: "They"},
        {verb: "slices", target: "your", target2: "You"},
        {verb: "slices", target: `${target}'s`, target2: "They"})
    })
    .setFailMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ConditionMessages.Hamstring.Fail,
        {verb: "attempt", target, verb2: "fail"},
        {verb: "attempts", target: "you", verb2: "fails"},
        {verb: "attempts", target, verb2: "fails"})
    })
    .create()
}

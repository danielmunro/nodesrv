import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
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
    .setApplySkill((checkedRequest, affectBuilder) => {
      const [ target, skill ] = checkedRequest.results(CheckType.HasTarget, CheckType.HasSkill)
      const amount = skill.level / 10
      target.vitals.hp -= amount
      return Promise.resolve(affectBuilder
        .setTimeout(amount)
        .build())
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Trip.Success,
        { verb: "trip", target },
        { verb: "trips", target: "you" },
        { verb: "trips", target })
    })
    .setFailMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Trip.Failure,
        { verb: "fail", target },
        { verb: "fails", target: "you" },
        { requestCreator: checkedRequest.mob, verb: "fails", target })
    })
    .create()
}

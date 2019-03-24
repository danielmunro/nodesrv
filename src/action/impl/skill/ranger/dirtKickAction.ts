import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
import {Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.DirtKick)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Blind)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setCosts([
      new MvCost(Costs.DirtKick.Mv),
      new DelayCost(Costs.DirtKick.Delay),
    ])
    .setApplySkill((checkedRequest, affectBuilder) =>
      Promise.resolve(affectBuilder
        .setTimeout(Math.max(1, checkedRequest.mob.level / 12, 5))
        .build()))
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SkillMessages.DirtKick.Success,
        { verb: "kick", target: `${target.name}'s` },
        { verb: "kicks", target: "your" },
        { verb: "kicks", target: `${target.name}'s` })
    })
    .setFailMessage(checkedRequest => {
      const mob = checkedRequest.mob
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        mob,
        SkillMessages.DirtKick.Fail,
        { requestCreator: "you", verb: "kick", verb2: "miss", target },
        { requestCreator: mob, verb: "kicks", verb2: "misses", target: "you" },
        { requestCreator: mob, verb: "kicks", verb2: "misses", target })
    })
    .create()
}

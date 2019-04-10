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
  return new SkillBuilder(abilityService, SkillType.Bash)
    .setActionType(ActionType.Offensive)
    .setAffectType(AffectType.Stunned)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
    .setCosts([
      new MvCost(Costs.Bash.Mv),
      new DelayCost(Costs.Bash.Delay),
    ])
    .setApplySkill(async (_, affectBuilder) => affectBuilder.setTimeout(1).build())
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        SkillMessages.Bash.Success,
        { target, verb: "slam", verb2: "send", target2: "them" },
        { target: "you", verb: "slams", verb2: "sends", target2: "you" },
        {target, verb: "slams", verb2: "sends", target2: "them"})
    })
    .setFailMessage(checkedRequest => {
      const mob = checkedRequest.mob
      return new ResponseMessage(
        mob,
        SkillMessages.Bash.Fail,
        { requestCreator: "you", verb: "fall", requestCreator2: "your"},
        { requestCreator: mob, verb: "falls", requestCreator2: "their"})
    })
    .create()
}

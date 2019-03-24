import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import ResponseMessage from "../../../../request/responseMessage"
import {ConditionMessages as PreconditionMessages, Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Sneak)
    .setActionType(ActionType.Neutral)
    .setAffectType(AffectType.Sneak)
    .setActionParts([ ActionPart.Action ])
    .setCheckBuilder((_, checkBuilder) =>
      checkBuilder.not().requireFight(PreconditionMessages.All.Fighting)
        .create())
    .setCosts([
      new MvCost(Costs.Sneak.Mv),
      new DelayCost(Costs.Sneak.Delay),
    ])
    .setApplySkill(async (checkedRequest, affectBuilder) =>
      affectBuilder.setTimeout(checkedRequest.mob.level).build())
    .setSuccessMessage(checkedRequest =>
      new ResponseMessage(
        checkedRequest.mob,
        SkillMessages.Sneak.Success))
    .setFailMessage(checkedRequest =>
      new ResponseMessage(
        checkedRequest.mob,
        SkillMessages.Sneak.Fail))
    .create()
}

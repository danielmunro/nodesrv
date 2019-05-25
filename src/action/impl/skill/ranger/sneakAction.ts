import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import ResponseMessage from "../../../../request/responseMessage"
import {ConditionMessages as PreconditionMessages, Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
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
    .setApplySkill(async (requestService, affectBuilder) =>
      affectBuilder.setTimeout(requestService.getMobLevel()).build())
    .setSuccessMessage(requestService =>
      new ResponseMessage(requestService.getMob(), SkillMessages.Sneak.Success))
    .setFailMessage(requestService =>
      new ResponseMessage(requestService.getMob(), SkillMessages.Sneak.Fail))
    .create()
}

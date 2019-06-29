import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {ConditionMessages as PreconditionMessages, Costs, SkillMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import {RequestType} from "../../../../request/enum/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.DetectHidden)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.DetectHidden)
    .setRequestType(RequestType.DetectHidden)
    .setActionParts([ ActionPart.Action ])
    .setCheckBuilder((_, checkBuilder) =>
      checkBuilder.not().requireFight(PreconditionMessages.All.Fighting).create())
    .setCosts([
      new MvCost(Costs.DetectHidden.Mv),
      new DelayCost(Costs.DetectHidden.Delay),
      new ManaCost(Costs.DetectHidden.Mana),
    ])
    .setApplySkill(async (requestService, affectBuilder) =>
      createApplyAbilityResponse(affectBuilder.setTimeout(requestService.getMobLevel() / 8).build()))
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.DetectHidden.Success)
        .setTargetPossessive()
        .setPluralizeTarget()
        .create())
    .setFailMessage(requestService =>
      new ResponseMessage(requestService.getMob(), SkillMessages.DetectHidden.Fail))
    .create()
}

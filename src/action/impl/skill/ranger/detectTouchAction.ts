import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import AbilityService from "../../../../check/service/abilityService"
import {RequestType} from "../../../../request/enum/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import {ConditionMessages as PreconditionMessages, Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.DetectTouch)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.DetectTouch)
    .setRequestType(RequestType.DetectTouch)
    .setActionParts([ ActionPart.Action ])
    .setCheckBuilder((_, checkBuilder) =>
      checkBuilder.not().requireFight(PreconditionMessages.All.Fighting)
        .create())
    .setCosts([
      new MvCost(Costs.DetectTouch.Mv),
      new DelayCost(Costs.DetectTouch.Delay),
      new ManaCost(Costs.DetectTouch.Mana),
    ])
    .setApplySkill(async (requestService, affectBuilder) =>
      affectBuilder.setTimeout(requestService.getMobLevel() / 8).build())
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SkillMessages.DetectTouch.Success)
        .setVerbToRequestCreator("are")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .setFailMessage(requestService =>
      new ResponseMessage(
        requestService.getMob(),
        SkillMessages.DetectTouch.Fail))
    .create()
}

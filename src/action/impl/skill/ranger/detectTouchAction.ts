import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {RequestType} from "../../../../request/requestType"
import ResponseMessage from "../../../../request/responseMessage"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
import {ConditionMessages as PreconditionMessages, Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
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
    .setApplySkill(async (checkedRequest, affectBuilder) =>
      affectBuilder.setTimeout(checkedRequest.mob.level / 8).build())
    .setSuccessMessage(checkedRequest =>
      new ResponseMessageBuilder(
        checkedRequest.mob,
        SkillMessages.DetectTouch.Success)
        .setVerbToRequestCreator("are")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .setFailMessage(checkedRequest =>
      new ResponseMessage(
        checkedRequest.mob,
        SkillMessages.DetectTouch.Fail))
    .create()
}

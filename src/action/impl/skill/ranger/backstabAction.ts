import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Fight} from "../../../../mob/fight/fight"
import ResponseMessage from "../../../../request/responseMessage"
import {ActionMessages, Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Backstab)
    .setActionType(ActionType.Offensive)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setCosts([
      new MvCost(Costs.Backstab.Mv),
      new DelayCost(Costs.Backstab.Delay),
    ])
    .setApplySkill(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      target.vitals.hp -= Fight.calculateDamageForOneHit(checkedRequest.mob, target)
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Backstab.Success,
        { target, verb: "backstab" },
        { verb: "backstabs" },
        { target, verb: "backstabs" })
    })
    .setFailMessage(checkedRequest => {
      const mob = checkedRequest.mob
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        mob,
        ActionMessages.Backstab.Failure,
        { target, verb: "dodges", requestCreator: "your" },
        { verb: "dodge", requestCreator: `${mob.name}'s`},
        { target, verb: "dodges", requestCreator: `${mob.name}'s`})
    })
    .create()
}

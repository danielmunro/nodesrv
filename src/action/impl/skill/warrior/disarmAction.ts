import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Equipment} from "../../../../item/equipment"
import {Item} from "../../../../item/model/item"
import {Mob} from "../../../../mob/model/mob"
import ResponseMessage from "../../../../request/responseMessage"
import {
  ActionMessages,
  Costs,
} from "../../../../skill/constants"
import { ConditionMessages as PreconditionMessages } from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Disarm)
    .setActionType(ActionType.Offensive)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setCosts([
      new MvCost(Costs.Disarm.Mv),
      new DelayCost(Costs.Disarm.Delay),
    ])
    .setCheckBuilder((_, checkBuilder) => {
      return checkBuilder.require(
        (__: any, target: Mob) => target.equipped.find((i: Item) => i.equipment === Equipment.Weapon),
          PreconditionMessages.Disarm.FailNothingToDisarm,
        CheckType.ItemPresent)
      .create()
    })
    .setApplySkill(checkedRequest => {
      const item = checkedRequest.getCheckTypeResult(CheckType.ItemPresent)
      checkedRequest.room.inventory.addItem(item)
      return Promise.resolve()
    })
    .setSuccessMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Disarm.Success,
        { target, gender: target.gender, verb: "disarm", verb2: "send" },
        { target: "you", gender: "your", verb: "disarms", verb2: "sends" },
        { target, gender: target.gender, verb: "disarms", verb2: "sends" })
    })
    .setFailMessage(checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      return new ResponseMessage(
        checkedRequest.mob,
        ActionMessages.Disarm.Failure,
        { target, verb: "fail" },
        { target: "you", verb: "fails" },
        { target, verb: "fails" })
    })
    .create()
}

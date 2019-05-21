import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {CheckType} from "../../../../check/enum/checkType"
import {Equipment} from "../../../../item/enum/equipment"
import {Item} from "../../../../item/model/item"
import {Mob} from "../../../../mob/model/mob"
import {
  ActionMessages,
  Costs,
} from "../../../../skill/constants"
import { ConditionMessages as PreconditionMessages } from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Disarm)
    .setActionType(ActionType.Offensive)
    .setActionParts([ ActionPart.Action, ActionPart.Target ])
    .setTouchesTarget()
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
    .setApplySkill(requestService => {
      const item = requestService.getResult(CheckType.ItemPresent)
      requestService.addItemToRoomInventory(item)
      return Promise.resolve()
    })
    .setSuccessMessage(requestService => {
      const target = requestService.getTarget()
      return requestService.createResponseMessage(ActionMessages.Disarm.Success)
        .setVerbToRequestCreator("disarm")
        .addReplacementForRequestCreator("gender", target.gender)
        .addReplacementForRequestCreator("verb2", "send")
        .setVerbToTarget("disarms")
        .addReplacementForTarget("gender", "your")
        .addReplacementForTarget("verb2", "sends")
        .setVerbToObservers("disarms")
        .addReplacementForObservers("gender", target.gender)
        .addReplacementForObservers("verb2", "sends")
        .create()
    })
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Disarm.Failure)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fails")
        .setVerbToObservers("fails")
        .create())
    .create()
}

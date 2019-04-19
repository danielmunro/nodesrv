import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import {CheckMessages} from "../../../../check/constants"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Mob} from "../../../../mob/model/mob"
import ResponseMessage from "../../../../request/responseMessage"
import {ActionMessages, ConditionMessages, Costs} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import roll from "../../../../support/random/dice"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Steal)
    .setActionType(ActionType.Neutral)
    .setActionParts([ ActionPart.Action, ActionPart.ItemWithRoomMob, ActionPart.Target ])
    .setTouchesTarget()
    .setCheckBuilder((request, checkBuilder) =>
      checkBuilder.not().requireFight(ConditionMessages.All.Fighting)
      .requireMobInRoom(CheckMessages.NoMob)
      .capture()
      .require(
        (target: Mob) => target.inventory.findItemByName(request.getSubject()),
        ConditionMessages.Steal.ErrorNoItem,
        CheckType.HasItem)
      .create())
    .setCosts([
      new MvCost(Costs.Steal.Mv),
      new DelayCost(Costs.Steal.Delay),
    ])
    .setApplySkill(async (requestService) => {
      const item = requestService.getResult(CheckType.HasItem)
      requestService.addItemToMobInventory(item)
      if (roll(1, 5) === 1) {
        await abilityService.publishEvent(requestService.createAttackEvent())
      }
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Steal.Success)
        .setVerbToRequestCreator("steal")
        .setVerbToTarget("steals")
        .setVerbToObservers("steals")
        .addReplacement("item", requestService.getResult(CheckType.HasItem))
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Steal.Failure)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fails")
        .setVerbToObservers("fails")
        .addReplacement("item", requestService.getResult(CheckType.HasItem))
        .create())
    .create()
}

import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {ActionMessages, ConditionMessages as PreconditionMessages, Costs} from "../../../../mob/skill/constants"
import {SkillEntity} from "../../../../mob/skill/entity/skillEntity"
import {SkillType} from "../../../../mob/skill/skillType"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Repair)
    .setActionType(ActionType.Neutral)
    .setActionParts([ ActionPart.Action, ActionPart.ItemInInventory ])
    .setCheckBuilder((request, checkBuilder) => {
      const item = request.findItemInSessionMobInventory() as ItemEntity
      return checkBuilder.not().requireFight(PreconditionMessages.All.Fighting)
        .require(item, PreconditionMessages.All.NoItem, CheckType.HasItem)
        .capture()
        .require(item.equipment,
          PreconditionMessages.Repair.ItemNotEquipment)
        .require(item.condition < 100,
          PreconditionMessages.Repair.ItemAlreadyInGoodCondition)
        .create()
    })
    .setCosts([
      new ManaCost(Costs.Repair.Mana),
      new MvCost(Costs.Repair.Mv),
      new DelayCost(Costs.Repair.Delay),
    ])
    .setApplySkill(async requestService => {
      const skill = requestService.getResult<SkillEntity>(CheckType.HasSkill)
      const item = requestService.getResult<ItemEntity>(CheckType.HasItem)
      const improvement = (Math.random() * skill.level) / 4
      item.condition = Math.min(item.condition + improvement, ItemEntity.maxCondition)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Repair.Success)
        .setVerbToRequestCreator("repair")
        .setVerbToTarget("repair")
        .setVerbToObservers("repairs")
        .addReplacement("item", requestService.getResult(CheckType.HasItem))
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Repair.Failure)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fail")
        .setVerbToObservers("fails")
        .addReplacement("item", requestService.getResult(CheckType.HasItem))
        .create())
    .create()
}

import {AffectEntity} from "../../../../affect/entity/affectEntity"
import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {Equipment} from "../../../../item/enum/equipment"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import {
  ActionMessages,
  ConditionMessages as PreconditionMessages,
  Costs,
} from "../../../../mob/skill/constants"
import {SkillEntity} from "../../../../mob/skill/entity/skillEntity"
import {SkillType} from "../../../../mob/skill/skillType"
import collectionSearch from "../../../../support/matcher/collectionSearch"
import roll from "../../../../support/random/dice"
import SkillBuilder from "../../../builder/skillBuilder"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Sharpen)
    .setActionType(ActionType.Neutral)
    .setAffectType(AffectType.Sharpened)
    .setActionParts([ ActionPart.Action, ActionPart.ItemInInventory ])
    .setCheckBuilder((request, checkBuilder) => {
      const item = collectionSearch(request.mob.inventory.items, request.getSubject())
      return checkBuilder.not().requireFight(PreconditionMessages.All.Fighting)
        .require(item, PreconditionMessages.All.NoItem, CheckType.HasItem)
        .capture()
        .require(
          item.affects.find((affect: AffectEntity) => affect.affectType === AffectType.Sharpened) === undefined,
          PreconditionMessages.Sharpen.AlreadySharpened)
        .require(
          item.equipment === Equipment.Weapon,
          PreconditionMessages.Sharpen.NotAWeapon)
        .require(
          item.damageType === DamageType.Slash,
          PreconditionMessages.Sharpen.NotABladedWeapon)
        .create()
    })
    .setCosts([
      new ManaCost(Costs.Sharpen.Mana),
      new MvCost(Costs.Sharpen.Mv),
      new DelayCost(Costs.Sharpen.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) => {
      const skill = requestService.getResult<SkillEntity>(CheckType.HasSkill)
      const item = requestService.getResult<ItemEntity>(CheckType.HasItem)
      const affect = affectBuilder
        .setAttributes(new AttributeBuilder()
          .setHitRoll(1, roll(1, skill.level / 10) + 1)
          .build())
        .build()
      item.affects.push(affect)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Sharpen.Success)
        .setVerbToRequestCreator("sharpen")
        .setVerbToTarget("sharpen")
        .setVerbToObservers("sharpens")
        .create())
    .setFailMessage(requestService =>
      requestService.createResponseMessage(ActionMessages.Sharpen.Failure)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fail")
        .setVerbToObservers("fails")
        .create())
    .create()
}

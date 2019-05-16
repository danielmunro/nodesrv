import {AffectType} from "../../../../affect/enum/affectType"
import {Affect} from "../../../../affect/model/affect"
import AttributeBuilder from "../../../../attributes/attributeBuilder"
import {newHitroll} from "../../../../attributes/factory"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MvCost from "../../../../check/cost/mvCost"
import {DamageType} from "../../../../damage/damageType"
import Weapon from "../../../../item/model/weapon"
import {
  ActionMessages,
  ConditionMessages as PreconditionMessages,
  Costs,
} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import collectionSearch from "../../../../support/matcher/collectionSearch"
import roll from "../../../../support/random/dice"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
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
          item.affects.find((affect: Affect) => affect.affectType === AffectType.Sharpened) === undefined,
          PreconditionMessages.Sharpen.AlreadySharpened)
        .require(
          item instanceof Weapon,
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
      const [ skill, item ] = requestService.getResults(CheckType.HasSkill, CheckType.HasItem)
      const affect = affectBuilder
        .setAttributes(new AttributeBuilder()
          .setHitRoll(newHitroll(1, roll(1, skill.level / 10) + 1))
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

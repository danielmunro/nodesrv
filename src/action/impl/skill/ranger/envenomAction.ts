import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import MvCost from "../../../../check/cost/mvCost"
import {Equipment} from "../../../../item/enum/equipment"
import {Item} from "../../../../item/model/item"
import Weapon from "../../../../item/model/weapon"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import ResponseMessage from "../../../../request/responseMessage"
import {ConditionMessages as PreconditionMessages, Costs, SkillMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import {ActionPart} from "../../../enum/actionPart"
import {ActionType} from "../../../enum/actionType"
import SkillBuilder from "../../../skillBuilder"
import Skill from "../../skill"

export default function(abilityService: AbilityService): Skill {
  return new SkillBuilder(abilityService, SkillType.Envenom)
    .setActionType(ActionType.Defensive)
    .setAffectType(AffectType.Poison)
    .setActionParts([ ActionPart.Action, ActionPart.ItemInInventory ])
    .setCheckBuilder((request, checkBuilder) => {
      const item = request.findItemInSessionMobInventory()
      return checkBuilder
        .require(
          item,
          PreconditionMessages.All.NoItem,
          CheckType.HasItem)
        .capture(item)
        .require((captured: Item) =>
          captured.equipment === Equipment.Weapon, SkillMessages.Envenom.Error.NotAWeapon)
        .require((captured: Weapon) =>
          captured.damageType === DamageType.Slash || captured.damageType === DamageType.Pierce,
          SkillMessages.Envenom.Error.WrongWeaponType)
        .create()
    })
    .setCosts([
      new MvCost(Costs.Envenom.Mana),
      new DelayCost(Costs.Envenom.Delay),
    ])
    .setApplySkill(async (requestService, affectBuilder) => {
      const item = requestService.getResult(CheckType.HasItem)
      item.affects.push(affectBuilder.build())
    })
    .setSuccessMessage(requestService => {
      const item = requestService.getResult(CheckType.HasItem)
      return requestService.createResponseMessage(SkillMessages.Envenom.Success)
        .addReplacement("item", item)
        .setVerbToRequestCreator("envenom")
        .setVerbToTarget("envenom")
        .setVerbToObservers("envenoms")
        .create()
    })
    .setFailMessage(requestService => {
      const item = requestService.getResult(CheckType.HasItem)
      return requestService.createResponseMessage(SkillMessages.Envenom.Fail)
        .addReplacement("item", item)
        .setVerbToRequestCreator("fail")
        .setVerbToTarget("fail")
        .setVerbToObservers("fails")
        .create()
    })
    .create()
}

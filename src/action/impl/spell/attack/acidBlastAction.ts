import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import DamageEvent from "../../../../mob/event/damageEvent"
import {getDamageDescriptor} from "../../../../mob/fight/damageDescriptor"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../spell/constants"
import {Spell as SpellModel} from "../../../../spell/model/spell"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponseWithEvent} from "../../../factory/responseFactory"
import Spell from "../../spell"

function calculateBaseDamage(spell: SpellModel, specializationType: SpecializationType): number {
  return roll(spell.level / 10, specializationType === SpecializationType.Mage ? 14 : 10)
}

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.AcidBlast)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(15),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      const [ target, spell ] = requestService.getResults(CheckType.HasTarget, CheckType.HasSpell)
      const eventResponse = await abilityService.publishEvent(
        requestService.createDamageEvent(
          calculateBaseDamage(spell, requestService.getMob().specializationType),
          DamageType.Acid).build())
      const event = eventResponse.event as DamageEvent
      target.vitals.hp -= event.amount
      return createApplyAbilityResponseWithEvent(event)
    })
    .setSuccessMessage(requestService => {
      const event = requestService.applyAbilityResponse.event as DamageEvent
      const descriptor = getDamageDescriptor(event.amount)
      return requestService.createResponseMessage(SpellMessages.AttackSpell.Success)
        .addReplacement("spellDescriptor", "blast of acid")
        .addReplacement("verb1", descriptor[1])
        .addReplacement("verb2", descriptor[2])
        .setSelfIdentifier("your")
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create()
    })
    .create()
}

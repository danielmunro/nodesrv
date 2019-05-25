import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import DamageEvent from "../../../../mob/event/damageEvent"
import {getMagicDamageDescriptor} from "../../../../mob/fight/damageDescriptor"
import {DamageType} from "../../../../mob/fight/enum/damageType"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../spell/constants"
import {Spell as SpellModel} from "../../../../spell/model/spell"
import {SpellType} from "../../../../spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponseWithEvent} from "../../../factory/responseFactory"
import Spell from "../../spell"

export type RollDamage = (spell: SpellModel, specializationType: SpecializationType) => number

export default function(
  abilityService: AbilityService,
  spellType: SpellType,
  damageType: DamageType,
  rollDamage: RollDamage,
  damageMessage: string): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(spellType)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(15),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      const [ target, spell ] = requestService.getResults(CheckType.HasTarget, CheckType.HasSpell)
      const eventResponse = await abilityService.publishEvent(
        requestService.createDamageEvent(
          rollDamage(spell, requestService.getMob().specializationType),
          damageType).build())
      const event = eventResponse.event as DamageEvent
      target.vitals.hp -= event.amount
      return createApplyAbilityResponseWithEvent(event)
    })
    .setSuccessMessage(requestService => {
      const event = requestService.applyAbilityResponse.event as DamageEvent
      const descriptor = getMagicDamageDescriptor(event.amount)
      const punctuation = event.amount < 40 ? "." : "!"
      return requestService.createResponseMessage(SpellMessages.AttackSpell.Success)
        .addReplacement("spellDescriptor", damageMessage)
        .addReplacementForRequestCreator("verb1", descriptor[1])
        .addReplacementForTarget("verb1", descriptor[1])
        .addReplacementForObservers("verb1", descriptor[1])
        .addReplacement("verb2", punctuation)
        .setPluralizeRequestCreator()
        .setSelfIdentifier("your")
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create()
    })
    .create()
}
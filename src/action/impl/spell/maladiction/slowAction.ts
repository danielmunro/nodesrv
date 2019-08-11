import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import roll from "../../../../support/random/dice"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Slow)
    .setAffectType(AffectType.Slow)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setApplySpell(async (requestService, affectBuilder) => {
      const aff = requestService.getTarget<MobEntity>().affect()
      if (aff.has(AffectType.Haste)) {
        aff.remove(AffectType.Haste)
        if (roll(1, 2) === 1) {
          return
        }
      }
      return createApplyAbilityResponse(affectBuilder
        .setTimeout(requestService.getMobLevel() / 7)
        .build())
    })
    .setSuccessMessage(requestService =>
      requestService.getTarget<MobEntity>().affect().has(AffectType.Slow) ?
        requestService.createResponseMessage(
          SpellMessages.Slow.Success)
          .setVerbToRequestCreator("starts")
          .setVerbToTarget("start")
          .setVerbToObservers("starts")
          .create()
      : requestService.createResponseMessage(
          SpellMessages.Slow.HasteStripped)
          .setVerbToRequestCreator("stops")
          .setVerbToTarget("stop")
          .setVerbToObservers("stops")
          .create())
    .setSpecializationType(SpecializationType.Mage)
    .create()
}

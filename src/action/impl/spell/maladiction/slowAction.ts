import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
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
      const aff = requestService.getTarget().affect()
      if (aff.has(AffectType.Haste)) {
        aff.remove(AffectType.Haste)
        if (roll(1, 2) === 1) {
          return
        }
      }
      return affectBuilder
        .setTimeout(requestService.getMobLevel() / 7)
        .build()
    })
    .setSuccessMessage(requestService =>
      requestService.getTarget().affect().has(AffectType.Slow) ?
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
    .create()
}

import {AffectType} from "../../../../affect/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
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
    .setApplySpell(async (checkedRequest, affectBuilder) => {
      const aff = checkedRequest.getTarget().affect()
      if (aff.has(AffectType.Haste)) {
        aff.remove(AffectType.Haste)
        if (roll(1, 2) === 1) {
          return
        }
      }
      return affectBuilder
        .setTimeout(checkedRequest.mob.level / 7)
        .build()
    })
    .setSuccessMessage(checkedRequest =>
      checkedRequest.getTarget().affect().has(AffectType.Slow) ?
        new ResponseMessageBuilder(
          checkedRequest.mob,
          SpellMessages.Slow.Success,
          checkedRequest.getTarget())
          .setVerbToRequestCreator("starts")
          .setVerbToTarget("start")
          .setVerbToObservers("starts")
          .create()
      : new ResponseMessageBuilder(
          checkedRequest.mob,
          SpellMessages.Slow.HasteStripped,
          checkedRequest.getTarget())
          .setVerbToRequestCreator("stops")
          .setVerbToTarget("stop")
          .setVerbToObservers("stops")
          .create())
    .create()
}

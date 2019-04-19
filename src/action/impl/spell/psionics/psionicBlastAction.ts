import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {DamageType} from "../../../../damage/damageType"
import DamageEvent from "../../../../mob/event/damageEvent"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import roll from "../../../../support/random/dice"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.PsionicBlast)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(12),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.PsionicBlast.Success)
      .setVerbToRequestCreator("is")
      .setVerbToTarget("are")
      .setVerbToObservers("is")
      .create())
    .setApplySpell(async requestService => {
      const target = requestService.getTarget()
      const eventResponse = await abilityService.publishEvent(new DamageEvent(
        target,
        roll(2, 6),
        DamageType.Mental,
        requestService.getMob()))
      target.vitals.hp -= (eventResponse.event as DamageEvent).amount
    })
    .create()
}

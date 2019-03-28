import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {DamageType} from "../../../../damage/damageType"
import DamageEvent from "../../../../mob/event/damageEvent"
import roll from "../../../../random/dice"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
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
    .setSuccessMessage(checkedRequest => new ResponseMessageBuilder(
      checkedRequest.mob,
      SpellMessages.PsionicBlast.Success,
      checkedRequest.getCheckTypeResult(CheckType.HasTarget))
      .setVerbToRequestCreator("is")
      .setVerbToTarget("are")
      .setVerbToObservers("is")
      .create())
    .setApplySpell(async checkedRequest => {
      const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
      const eventResponse = await abilityService.publishEvent(new DamageEvent(
        target,
        roll(2, 6),
        DamageType.Mental,
        checkedRequest.mob))
      target.vitals.hp -= (eventResponse.event as DamageEvent).amount
    })
    .create()
}

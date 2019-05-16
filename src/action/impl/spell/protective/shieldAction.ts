import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import ResponseMessage from "../../../../request/responseMessage"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Shield)
    .setAffectType(AffectType.Shield)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(12),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Shield.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(requestService.getMobLevel())
      .build())
    .create()
}

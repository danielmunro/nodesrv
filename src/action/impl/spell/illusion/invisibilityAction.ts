import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Invisibility)
    .setAffectType(AffectType.Invisible)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(10),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Invisibility.Success)
        .setVerbToRequestCreator("fades")
        .setVerbToTarget("fade")
        .setVerbToObservers("fades")
        .create())
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(requestService.getMobLevel() / 2)
      .build())
    .create()
}

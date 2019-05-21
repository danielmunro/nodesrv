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
    .setSpellType(SpellType.StoneSkin)
    .setAffectType(AffectType.StoneSkin)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(12),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.StoneSkin.Success)
        .setTargetPossessive()
        .setPluralizeTarget()
        .create())
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(requestService.getMobLevel())
      .build())
    .create()
}

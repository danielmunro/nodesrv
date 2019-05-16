import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import DamageSourceBuilder from "../../../../mob/fight/damageSourceBuilder"
import ResponseMessage from "../../../../request/responseMessage"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.TowerOfIronWill)
    .setAffectType(AffectType.TowerOfIronWill)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.TowerOfIronWill.Success)
        .setPluralizeTarget()
        .setTargetPossessive()
        .create())
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(requestService.getMobLevel() / 7)
      .setResist(new DamageSourceBuilder().enableMental().get())
      .build())
    .create()
}

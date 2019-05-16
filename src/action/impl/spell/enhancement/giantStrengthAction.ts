import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/attributeBuilder"
import {newStats} from "../../../../attributes/factory"
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
    .setSpellType(SpellType.GiantStrength)
    .setAffectType(AffectType.GiantStrength)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.GiantStrength.Success)
        .setPluralizeTarget()
        .setTargetPossessive()
        .create())
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
        .setAttributes(new AttributeBuilder()
          .setStats(
            newStats(requestService.getMobLevel() / 10, 0, 0, 0, 0, 0))
          .build())
        .build())
    .create()
}

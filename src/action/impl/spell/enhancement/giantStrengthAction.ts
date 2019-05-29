import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
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
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
        .setAttributes(new AttributeBuilder()
          .setStats(requestService.getMobLevel() / 10, 0, 0, 0, 0, 0)
          .build())
        .build()))
    .create()
}

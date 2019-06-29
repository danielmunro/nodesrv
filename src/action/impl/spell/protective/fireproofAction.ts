import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Fireproof)
    .setAffectType(AffectType.Fireproof)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(10),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(
        SpellMessages.Fireproof.Success)
        .setVerbToRequestCreator("glows")
        .setVerbToTarget("glow")
        .setVerbToObservers("glows")
        .create())
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
      .setTimeout(requestService.getMobLevel() / 8)
      .build()))
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}

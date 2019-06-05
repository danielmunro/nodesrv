import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.OrbOfTouch)
    .setAffectType(AffectType.OrbOfTouch)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(100),
      new DelayCost(2),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.OrbOfTouch.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
      .setTimeout(requestService.getMobLevel())
      .setAttributes(new AttributeBuilder()
        .setHitRoll(1, requestService.getMobLevel() / 7)
        .build())
      .build()))
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}

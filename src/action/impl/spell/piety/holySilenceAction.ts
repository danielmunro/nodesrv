import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import {createApplyAbilityResponse} from "../../../factory/responseFactory"

export default function(abilityService: AbilityService) {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.HolySilence)
    .setAffectType(AffectType.HolySilence)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(30),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.HolySilence.Success)
      .setVerbToRequestCreator("falls")
      .setVerbToTarget("fall")
      .setVerbToObservers("falls")
      .create())
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
      .setTimeout(requestService.getMobLevel() / 8)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(1, requestService.getMobLevel() / 8)
        .build())
      .build()))
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}

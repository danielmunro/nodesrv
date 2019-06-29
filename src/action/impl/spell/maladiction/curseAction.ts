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
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Curse)
    .setAffectType(AffectType.Curse)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(20), new DelayCost(1) ])
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
      .setTimeout(requestService.getMobLevel() / 10)
      .setAttributes(new AttributeBuilder()
        .setStats(-1, -1, -1, -1, -1, -1)
        .setHitRoll(1, -4)
        .build())
      .build()))
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Curse.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .setSpecializationType(SpecializationType.Mage)
    .create()
}

import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import {newStats} from "../../../../attributes/factory/attributeFactory"
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
    .setSpellType(SpellType.Wrath)
    .setAffectType(AffectType.Wrath)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(35), new DelayCost(1) ])
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
      .setAttributes(new AttributeBuilder()
        .setVitals(-requestService.getMobLevel() / 10, 0, 0)
        .setStats(newStats(0, -2, -2, 0, 0, 0))
        .setHitRoll(1, -4)
        .build())
      .build()))
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Wrath.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .create()
}

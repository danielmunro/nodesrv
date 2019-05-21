import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import {newHitroll, newStats, newVitals} from "../../../../attributes/factory/attributeFactory"
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
    .setSpellType(SpellType.Wrath)
    .setAffectType(AffectType.Wrath)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(35), new DelayCost(1) ])
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setAttributes(new AttributeBuilder()
        .setVitals(newVitals(-requestService.getMobLevel() / 10, 0, 0))
        .setStats(newStats(0, -2, -2, 0, 0, 0))
        .setHitRoll(newHitroll(1, -4))
        .build())
      .build())
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Wrath.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .create()
}

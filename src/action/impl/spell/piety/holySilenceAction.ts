import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/attributeBuilder"
import {newHitroll} from "../../../../attributes/factory"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"

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
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(requestService.getMobLevel() / 8)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(newHitroll(1, requestService.getMobLevel() / 8))
        .build())
      .build())
    .create()
}

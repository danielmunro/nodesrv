import {AffectType} from "../../../../../affect/affectType"
import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll} from "../../../../../attributes/factory"
import AbilityService from "../../../../../check/abilityService"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import ResponseMessageBuilder from "../../../../../request/responseMessageBuilder"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import SpellBuilder from "../../../../spellBuilder"

export default function(abilityService: AbilityService) {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.HolySilence)
    .setAffectType(AffectType.HolySilence)
    .setActionType(ActionType.Offensive)
    .setCosts([
      new ManaCost(30),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest => new ResponseMessageBuilder(
      checkedRequest.mob,
      SpellMessages.HolySilence.Success,
      checkedRequest.getTarget())
      .setVerbToRequestCreator("falls")
      .setVerbToTarget("fall")
      .setVerbToObservers("falls")
      .create())
    .setApplySpell(async (checkedRequest, affectBuilder) => affectBuilder
      .setTimeout(checkedRequest.mob.level / 8)
      .setAttributes(new AttributeBuilder()
        .setHitRoll(newHitroll(1, checkedRequest.mob.level / 8))
        .build())
      .build())
    .create()
}

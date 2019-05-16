import {AffectType} from "../../../../affect/enum/affectType"
import AttributeBuilder from "../../../../attributes/attributeBuilder"
import {newHitroll, newStats} from "../../../../attributes/factory"
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
    .setSpellType(SpellType.Curse)
    .setAffectType(AffectType.Curse)
    .setActionType(ActionType.Offensive)
    .setCosts([ new ManaCost(20), new DelayCost(1) ])
    .setApplySpell(async (requestService, affectBuilder) => affectBuilder
      .setTimeout(requestService.getMobLevel() / 10)
      .setAttributes(new AttributeBuilder()
        .setStats(newStats(-1, -1, -1, -1, -1, -1))
        .setHitRoll(newHitroll(1, -4))
        .build())
      .build())
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Curse.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .create()
}

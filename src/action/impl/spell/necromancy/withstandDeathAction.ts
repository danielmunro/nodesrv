import {AffectType} from "../../../../affect/enum/affectType"
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
    .setSpellType(SpellType.WithstandDeath)
    .setAffectType(AffectType.WithstandDeath)
    .setActionType(ActionType.Defensive)
    .setCosts([ new ManaCost(80), new DelayCost(2) ])
    .setApplySpell(async (requestService, affectBuilder) =>
      createApplyAbilityResponse(affectBuilder
      .setTimeout(requestService.getMobLevel() / 8)
      .build()))
    .setSuccessMessage(requestService => requestService.createResponseMessage(
      SpellMessages.WithstandDeath.Success)
      .setVerbToRequestCreator("feels")
      .setVerbToTarget("feel")
      .setVerbToObservers("feels")
      .create())
    .create()
}

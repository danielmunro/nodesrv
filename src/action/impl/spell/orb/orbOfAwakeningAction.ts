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
    .setSpellType(SpellType.OrbOfAwakening)
    .setAffectType(AffectType.OrbOfAwakening)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(100),
      new DelayCost(2),
    ])
    .setSuccessMessage(responseService =>
      responseService.createResponseMessage(SpellMessages.OrbOfAwakening.Success)
        .setVerbToRequestCreator("is")
        .setVerbToTarget("are")
        .setVerbToObservers("is")
        .create())
    .setApplySpell(async (requestService, affectBuilder) => createApplyAbilityResponse(affectBuilder
      .setTimeout(requestService.getMobLevel())
      .build()))
    .setSpecializationType(SpecializationType.Cleric)
    .create()
}

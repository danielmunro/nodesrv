import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.WordOfRecall)
    .setActionType(ActionType.Defensive)
    .addToCheckBuilder((_, checkBuilder) =>
      checkBuilder.not().requireFight())
    .setCosts([
      new ManaCost(10),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => {
      await abilityService.updateMobLocation(requestService.getTarget())
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.WordOfRecall.Success)
        .setVerbToRequestCreator("disappears")
        .setVerbToTarget("disappear")
        .setVerbToObservers("disappears")
        .create())
    .create()
}

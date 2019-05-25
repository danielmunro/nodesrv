import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import LocationService from "../../../../mob/service/locationService"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService, locationService: LocationService): Spell {
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
      const room = locationService.getRecall()
      await locationService.updateMobLocation(requestService.getTarget(), room)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.WordOfRecall.Success)
        .setVerbToRequestCreator("disappears")
        .setVerbToTarget("disappear")
        .setVerbToObservers("disappears")
        .create())
    .create()
}

import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import LocationService from "../../../../mob/locationService"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
import {Room} from "../../../../room/model/room"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
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
    .setApplySpell(async checkedRequest => {
      const room = locationService.getRecall() as Room
      await locationService.updateMobLocation(checkedRequest.getTarget(), room)
    })
    .setSuccessMessage(checkedRequest =>
      new ResponseMessageBuilder(
        checkedRequest.mob,
        SpellMessages.WordOfRecall.Success,
        checkedRequest.getTarget())
        .setVerbToRequestCreator("disappears")
        .setVerbToTarget("disappear")
        .setVerbToObservers("disappears")
        .create())
    .create()
}

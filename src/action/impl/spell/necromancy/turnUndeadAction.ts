import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {Disposition} from "../../../../mob/enum/disposition"
import MobService from "../../../../mob/mobService"
import {Mob} from "../../../../mob/model/mob"
import {RaceType} from "../../../../mob/race/enum/raceType"
import ResponseMessage from "../../../../request/responseMessage"
import RoomMessageEvent from "../../../../room/event/roomMessageEvent"
import {Room} from "../../../../room/model/room"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {percentRoll} from "../../../../support/random/helpers"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

async function turn(room: Room, target: Mob, abilityService: AbilityService) {
  target.disposition = Disposition.Dead
  await abilityService.publishEvent(new RoomMessageEvent(
    room,
    new ResponseMessage(
      target,
      SpellMessages.TurnUndead.MobTurned,
      { target })))
}

export default function(abilityService: AbilityService, mobService: MobService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.TurnUndead)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(50),
      new DelayCost(1),
    ])
    .setSuccessMessage(checkedRequest => new ResponseMessage(
      checkedRequest.mob,
      SpellMessages.TurnUndead.Success))
    .setApplySpell(async checkedRequest => {
      await Promise.all(mobService.getMobsByRoom(checkedRequest.room)
        .filter(mob => mob.raceType === RaceType.Undead)
        .filter(mob => percentRoll() < 100 - mob.level)
        .map(mob => turn(checkedRequest.room, mob, abilityService)))
    })
    .create()
}

import AbilityService from "../../../../../check/abilityService"
import CheckedRequest from "../../../../../check/checkedRequest"
import Cost from "../../../../../check/cost/cost"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import {Disposition} from "../../../../../mob/enum/disposition"
import MobService from "../../../../../mob/mobService"
import {Mob} from "../../../../../mob/model/mob"
import {Race} from "../../../../../mob/race/race"
import {percentRoll} from "../../../../../random/helpers"
import ResponseMessage from "../../../../../request/responseMessage"
import RoomMessageEvent from "../../../../../room/event/roomMessageEvent"
import {Room} from "../../../../../room/model/room"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {Messages} from "../../../../constants"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../spell"
import SpellBuilder from "../../../../spellBuilder"
import ResponseMessageBuilder from "../../../../../request/responseMessageBuilder"
import {CheckType} from "../../../../../check/checkType"
import DamageEvent from "../../../../../mob/event/damageEvent"
import roll from "../../../../../random/dice"
import {DamageType} from "../../../../../damage/damageType"

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
      mobService.locationService.getMobsInRoomWithMob(checkedRequest.mob)
        .filter(mob => mob.race === Race.Undead)
        .filter(mob => percentRoll() < 100 - mob.level)
        .forEach(mob => turn(checkedRequest.room, mob, abilityService))
    })
    .create()
}

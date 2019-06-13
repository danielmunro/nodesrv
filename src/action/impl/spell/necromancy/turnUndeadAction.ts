import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {createRoomMessageEvent} from "../../../../event/factory/eventFactory"
import {Disposition} from "../../../../mob/enum/disposition"
import {Mob} from "../../../../mob/model/mob"
import {RaceType} from "../../../../mob/race/enum/raceType"
import MobService from "../../../../mob/service/mobService"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import ResponseMessage from "../../../../request/responseMessage"
import {RoomEntity} from "../../../../room/entity/roomEntity"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {percentRoll} from "../../../../support/random/helpers"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

async function turn(room: RoomEntity, target: Mob, abilityService: AbilityService) {
  target.disposition = Disposition.Dead
  await abilityService.publishEvent(createRoomMessageEvent(
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
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.TurnUndead.Success)
        .create())
    .setApplySpell(async requestService => {
      const location = mobService.getLocationForMob(requestService.getMob())
      await Promise.all(mobService.getMobsByRoom(location.room)
        .filter(mob => mob.raceType === RaceType.Undead)
        .filter(mob => percentRoll() < 100 - mob.level)
        .map(mob => turn(location.room, mob, abilityService)))
    })
    .setSpecializationType(SpecializationType.Mage)
    .create()
}

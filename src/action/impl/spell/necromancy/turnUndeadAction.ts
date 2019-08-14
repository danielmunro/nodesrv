import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {createRoomMessageEvent} from "../../../../event/factory/eventFactory"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {Disposition} from "../../../../mob/enum/disposition"
import {RaceType} from "../../../../mob/race/enum/raceType"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import ResponseMessage from "../../../../request/responseMessage"
import {RoomEntity} from "../../../../room/entity/roomEntity"
import {percentRoll} from "../../../../support/random/helpers"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

async function turn(room: RoomEntity, target: MobEntity, abilityService: AbilityService) {
  target.disposition = Disposition.Dead
  await abilityService.publishEvent(createRoomMessageEvent(
    room,
    new ResponseMessage(
      target,
      SpellMessages.TurnUndead.MobTurned,
      { target })))
}

export default function(abilityService: AbilityService): Spell {
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
      await Promise.all(abilityService.getMobsByRoom(requestService.getRoom())
        .filter(mob => mob.raceType === RaceType.Undead)
        .filter(mob => percentRoll() < 100 - mob.level)
        .map(mob => turn(requestService.getRoom(), mob, abilityService)))
    })
    .setSpecializationType(SpecializationType.Mage)
    .create()
}

import AbilityService from "../../../../check/abilityService"
import {CheckType} from "../../../../check/checkType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import MobService from "../../../../mob/mobService"
import {Mob} from "../../../../mob/model/mob"
import ResponseMessageBuilder from "../../../../request/responseMessageBuilder"
import RoomMessageEvent from "../../../../room/event/roomMessageEvent"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import match from "../../../../support/matcher/match"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export default function(abilityService: AbilityService, mobService: MobService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Summon)
    .setActionType(ActionType.Neutral)
    .setCosts([
      new ManaCost(80),
      new DelayCost(1),
    ])
    .addToCheckBuilder(async (request, checkBuilder) => {
      const target = mobService.findMob(mob => match(mob.name, request.getComponent())) as Mob
      checkBuilder.require(
        target,
        SpellMessages.Summon.MobNotFound,
        CheckType.HasTarget)
      .require(
        () => !target.traits.noTrans,
        SpellMessages.Summon.MobCannotBeSummoned)
      .require(
        () => target.level <= request.mob.level,
        SpellMessages.Summon.NotEnoughExperience)
    })
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.Summon.Success)
        .setVerbToRequestCreator("arrives")
        .setVerbToTarget("arrive")
        .setVerbToObservers("arrives")
        .create())
    .setApplySpell(async requestService => {
      const target = requestService.getTarget()
      const location = mobService.getLocationForMob(target)
      if (location) {
        await abilityService.publishEvent(
          new RoomMessageEvent(
            location.room,
            new ResponseMessageBuilder(
              target,
              SpellMessages.Summon.MobDisappeared)
              .setVerbToRequestCreator("disappear")
              .setVerbToTarget("disappear")
              .setVerbToObservers("disappears")
              .create()))
      }
      const toRoom = mobService.getLocationForMob(requestService.getMob())
      await mobService.updateMobLocation(
        requestService.getTarget(),
        toRoom.room)
    })
    .create()
}

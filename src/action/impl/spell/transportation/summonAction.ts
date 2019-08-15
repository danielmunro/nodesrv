import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import {createRoomMessageEvent} from "../../../../event/factory/eventFactory"
import ResponseMessageBuilder from "../../../../messageExchange/builder/responseMessageBuilder"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import withValue from "../../../../support/functional/withValue"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.Summon)
    .setActionType(ActionType.Neutral)
    .setCosts([
      new ManaCost(80),
      new DelayCost(1),
    ])
    .addToCheckBuilder(async (request, checkBuilder) => {
      const target = abilityService.findMob(request.getComponent()) as MobEntity
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
      const target = requestService.getTarget<MobEntity>()
      await withValue(
        abilityService.getLocationForMob(target),
        location => abilityService.publishEvent(
          createRoomMessageEvent(
            location.room,
            new ResponseMessageBuilder(
              target,
              SpellMessages.Summon.MobDisappeared)
              .setVerbToRequestCreator("disappear")
              .setVerbToTarget("disappear")
              .setVerbToObservers("disappears")
              .create())))
      await abilityService.updateMobLocation(
        requestService.getTarget(),
        requestService.getRoom())
    })
    .create()
}

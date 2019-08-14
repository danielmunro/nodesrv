import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import ContainerEntity from "../../../../item/entity/containerEntity"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RoomEntity} from "../../../../room/entity/roomEntity"
import SpellBuilder from "../../../builder/spellBuilder"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

function reduceCarriedBy(carriedBy: MobEntity | RoomEntity | ContainerEntity) {
  if (carriedBy instanceof MobEntity) {
    return `carried by ${carriedBy.name}`
  } else if (carriedBy instanceof RoomEntity) {
    return `in ${carriedBy.name}`
  }

  return `in a container`
}

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.LocateItem)
    .setActionType(ActionType.Neutral)
    .addToCheckBuilder((request, checkBuilder) => {
      const foundItem = abilityService.findItems(request.getMob(), request.getRoomRegion(), request.getComponent())
      checkBuilder.require(foundItem.item, Messages.LocateItem.Fail, CheckType.HasTarget)
      checkBuilder.require(foundItem.mobs, Messages.LocateItem.Fail, CheckType.HasItem)
    })
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.LocateItem.Success)
        .addReplacement(
          "rooms",
          requestService.getResult<ItemEntity[]>(CheckType.HasItem).reduce((previous: string, current: any) =>
            previous + "\n" + reduceCarriedBy(current), ""))
        .create())
    .create()
}

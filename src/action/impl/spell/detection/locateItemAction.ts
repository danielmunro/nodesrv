import {AffectType} from "../../../../affect/enum/affectType"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import AbilityService from "../../../../check/service/abilityService"
import StateService from "../../../../gameService/stateService"
import ContainerEntity from "../../../../item/entity/containerEntity"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import ItemService from "../../../../item/service/itemService"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {RegionEntity} from "../../../../region/entity/regionEntity"
import {RoomEntity} from "../../../../room/entity/roomEntity"
import {SpellMessages} from "../../../../spell/constants"
import {SpellEntity as SpellModel} from "../../../../spell/entity/spellEntity"
import {SpellType} from "../../../../spell/spellType"
import match from "../../../../support/matcher/match"
import {percentRoll} from "../../../../support/random/helpers"
import SpellBuilder from "../../../builder/spellBuilder"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

function filterItem(
  stateService: StateService,
  mob: MobEntity,
  region: RegionEntity,
  item: ItemEntity,
  input: string,
  spell: SpellModel): boolean {
  return match(item.name, input) &&
    stateService.canMobSee(mob, region) &&
    mob.level >= item.level &&
    !item.affects.find(affect => affect.affectType === AffectType.NoLocate) &&
    percentRoll() < 2 * spell.level
}

function reduceCarriedBy(carriedBy: MobEntity | RoomEntity | ContainerEntity) {
  if (carriedBy instanceof MobEntity) {
    return `carried by ${carriedBy.name}`
  } else if (carriedBy instanceof RoomEntity) {
    return `in ${carriedBy.name}`
  } else if (carriedBy instanceof ContainerEntity) {
    return `in a container`
  }

  return `found at ${carriedBy.name}`
}

export default function(abilityService: AbilityService, itemService: ItemService, stateService: StateService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.LocateItem)
    .setActionType(ActionType.Neutral)
    .addToCheckBuilder((request, checkBuilder) => {
      let item: ItemEntity
      const items = itemService.itemTable.items
        .filter(i => {
          item = i
          return filterItem(
            stateService,
            request.mob,
            request.getRoomRegion(),
            i,
            request.getComponent(),
            request.mob.spells.find(spell => spell.spellType === SpellType.LocateItem) as SpellModel)
        })
        .map(i => i.carriedBy)
      checkBuilder.require(
        item,
        Messages.LocateItem.Fail,
        CheckType.HasTarget)
      checkBuilder.require(
        items,
        Messages.LocateItem.Fail,
        CheckType.HasItem)
    })
    .setCosts([
      new ManaCost(20),
      new DelayCost(1),
    ])
    .setSuccessMessage(requestService =>
      requestService.createResponseMessage(SpellMessages.LocateItem.Success)
        .addReplacement(
          "rooms",
          requestService.getResult(CheckType.HasItem).reduce((previous: string, current: any) =>
            previous + "\n" + reduceCarriedBy(current), ""))
        .create())
    .create()
}

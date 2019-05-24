import {AffectType} from "../../../../affect/enum/affectType"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {CheckType} from "../../../../check/enum/checkType"
import StateService from "../../../../gameService/stateService"
import Container from "../../../../item/model/container"
import {Item} from "../../../../item/model/item"
import ItemService from "../../../../item/service/itemService"
import {Mob} from "../../../../mob/model/mob"
import {Region} from "../../../../region/model/region"
import {Room} from "../../../../room/model/room"
import {SpellMessages} from "../../../../spell/constants"
import {Spell as SpellModel} from "../../../../spell/model/spell"
import {SpellType} from "../../../../spell/spellType"
import match from "../../../../support/matcher/match"
import {percentRoll} from "../../../../support/random/helpers"
import SpellBuilder from "../../../builder/spellBuilder"
import {Messages} from "../../../constants"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

function filterItem(
  stateService: StateService,
  mob: Mob,
  region: Region,
  item: Item,
  input: string,
  spell: SpellModel): boolean {
  return match(item.name, input) &&
    stateService.canMobSee(mob, region) &&
    mob.level >= item.level &&
    !item.affects.find(affect => affect.affectType === AffectType.NoLocate) &&
    percentRoll() < 2 * spell.level
}

function reduceCarriedBy(carriedBy: Mob | Room | Container) {
  if (carriedBy instanceof Mob) {
    return `carried by ${carriedBy.name}`
  } else if (carriedBy instanceof Room) {
    return `in ${carriedBy.name}`
  } else if (carriedBy instanceof Container) {
    return `in a container`
  }

  return `found at ${carriedBy.name}`
}

export default function(abilityService: AbilityService, itemService: ItemService, stateService: StateService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.LocateItem)
    .setActionType(ActionType.Neutral)
    .addToCheckBuilder((request, checkBuilder) => {
      let item: Item
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

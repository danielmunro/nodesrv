import Cost from "../src/check/cost/cost"
import {CostType} from "../src/check/cost/costType"
import EventService from "../src/event/service/eventService"
import StateService from "../src/gameService/stateService"
import TimeService from "../src/gameService/timeService"
import ItemService from "../src/item/service/itemService"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/service/locationService"
import MobService from "../src/mob/service/mobService"
import MobTable from "../src/mob/table/mobTable"
import WeatherService from "../src/region/service/weatherService"
import {Room} from "../src/room/model/room"
import ExitTable from "../src/room/table/exitTable"
import RoomTable from "../src/room/table/roomTable"
import {getSkillTable} from "../src/skill/skillTable"
import getSpellTable from "../src/spell/spellTable"

const eventService = new EventService()
const locationService = new LocationService(new RoomTable(), eventService, new ExitTable(), new Room())
const mobService = new MobService(new MobTable(), locationService, new MobTable(), new FightTable())

console.log("spells:")
getSpellTable(
  mobService,
  eventService,
  new ItemService(),
  new StateService(new WeatherService(), new TimeService()),
  locationService).forEach(spell => {
  console.log(spell.getCosts().reduce((previous: string, cost: Cost) =>
    previous + ", " + getCostTypeLabel(cost.costType) + ": " + cost.amount, spell.getSpellType()))
})

console.log("\nskills:")
getSkillTable(mobService, eventService).forEach(skill => {
  console.log(skill.getCosts().reduce((previous: string, cost: Cost) =>
    previous + ", " + getCostTypeLabel(cost.costType) + ": " + cost.amount, skill.getSkillType()))
})

function getCostTypeLabel(costType: CostType): string {
  switch (costType) {
    case CostType.Mv:
      return "mv"
    case CostType.Delay:
      return "delay"
    case CostType.Mana:
      return "mana"
    case CostType.Train:
      return "train"
    default:
      return ""
  }
}

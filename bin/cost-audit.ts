import Cost from "../src/check/cost/cost"
import {CostType} from "../src/check/cost/costType"
import EventService from "../src/event/eventService"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/locationService"
import MobService from "../src/mob/mobService"
import MobTable from "../src/mob/mobTable"
import ExitTable from "../src/room/exitTable"
import RoomTable from "../src/room/roomTable"
import {getSkillTable} from "../src/skill/skillTable"
import getSpellTable from "../src/spell/spellTable"

const eventService = new EventService()
const mobService = new MobService(
  new MobTable(),
  new MobTable(),
  new FightTable(),
  new LocationService(new RoomTable(), eventService, new ExitTable()))

console.log("spells:")
getSpellTable(mobService, eventService).forEach(spell => {
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

import {CostType} from "../src/check/cost/costType"
import EventService from "../src/event/eventService"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/locationService"
import MobService from "../src/mob/mobService"
import MobTable from "../src/mob/mobTable"
import ExitTable from "../src/room/exitTable"
import RoomTable from "../src/room/roomTable"
import getSpellTable from "../src/spell/spellTable"

const eventService = new EventService()
const mobService = new MobService(
  new MobTable(),
  new MobTable(),
  new FightTable(),
  new LocationService(new RoomTable(), eventService, new ExitTable()))

getSpellTable(mobService, eventService).forEach(spell => {
  if (!spell.getCosts().filter(cost => cost.costType === CostType.Delay).length) {
    console.log(`missing delay: ${spell.getSpellType()}`)
  }
})

import EventService from "../src/event/eventService"
import StateService from "../src/gameService/stateService"
import TimeService from "../src/gameService/timeService"
import ItemService from "../src/item/itemService"
import FightTable from "../src/mob/fight/fightTable"
import MobTable from "../src/mob/mobTable"
import LocationService from "../src/mob/service/locationService"
import MobService from "../src/mob/service/mobService"
import {defaultSpecializationLevels} from "../src/mob/specialization/specializationLevels"
import WeatherService from "../src/region/weatherService"
import {Room} from "../src/room/model/room"
import ExitTable from "../src/room/table/exitTable"
import RoomTable from "../src/room/table/roomTable"
import {getSkillTable} from "../src/skill/skillTable"
import getSpellTable from "../src/spell/spellTable"

const eventService = new EventService()
const locationService = new LocationService(new RoomTable(), eventService, new ExitTable(), new Room())
const mobService = new MobService(new MobTable(), locationService, new MobTable(), new FightTable())

const skills = getSkillTable(mobService, eventService)
const spells = getSpellTable(
  mobService,
  eventService,
  new ItemService(),
  new StateService(new WeatherService(), new TimeService()),
  locationService)

const skillsWithoutLevel = skills.filter(skill =>
  !defaultSpecializationLevels.find(spec => spec.abilityType === skill.getSkillType()))
const spellsWithoutLevel = spells.filter(spell =>
  !defaultSpecializationLevels.find(spec => spec.abilityType === spell.getSpellType()))

console.log("unmapped skills")
skillsWithoutLevel
  .forEach(skill => console.log(skill.getSkillType()))

console.log("\nunmapped spells")
spellsWithoutLevel
  .forEach(spell => console.log(spell.getSpellType()))

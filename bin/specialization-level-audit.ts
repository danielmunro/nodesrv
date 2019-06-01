import EventService from "../src/event/service/eventService"
import StateService from "../src/gameService/stateService"
import TimeService from "../src/gameService/timeService"
import ItemService from "../src/item/service/itemService"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/service/locationService"
import MobService from "../src/mob/service/mobService"
import {defaultSpecializationLevels} from "../src/mob/specialization/specializationLevels"
import MobTable from "../src/mob/table/mobTable"
import WeatherService from "../src/region/service/weatherService"
import {createRoom} from "../src/room/factory/roomFactory"
import ExitTable from "../src/room/table/exitTable"
import RoomTable from "../src/room/table/roomTable"
import {getSkillTable} from "../src/skill/skillTable"
import getSpellTable from "../src/spell/spellTable"

const eventService = new EventService()
const locationService = new LocationService(new RoomTable(), eventService, createRoom())
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

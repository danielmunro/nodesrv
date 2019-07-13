import EventService from "../src/event/service/eventService"
import StateService from "../src/gameService/stateService"
import TimeService from "../src/gameService/timeService"
import ItemService from "../src/item/service/itemService"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/service/locationService"
import MobService from "../src/mob/service/mobService"
import {getSkillTable} from "../src/mob/skill/skillTable"
import {defaultSpecializationLevels} from "../src/mob/specialization/specializationLevels/specializationLevels"
import getSpellTable from "../src/mob/spell/spellTable"
import MobTable from "../src/mob/table/mobTable"
import WeatherService from "../src/region/service/weatherService"
import {createRoom} from "../src/room/factory/roomFactory"

const eventService = new EventService()
const locationService = new LocationService(eventService, createRoom())
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

import EventService from "../src/event/eventService"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/locationService"
import MobService from "../src/mob/mobService"
import MobTable from "../src/mob/mobTable"
import {defaultSpecializationLevels, gainSpecializationLevels} from "../src/mob/specialization/specializationLevels"
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

const skills = getSkillTable(mobService, eventService)
const spells = getSpellTable(mobService, eventService)

const skillsWithoutLevel = skills.filter(skill =>
  !defaultSpecializationLevels.find(spec => spec.abilityType === skill.getSkillType()))
const spellsWithoutLevel = spells.filter(spell =>
  !defaultSpecializationLevels.find(spec => spec.abilityType === spell.getSpellType()))

console.log("unmapped skills")
skillsWithoutLevel
  .filter(skill => !gainSpecializationLevels.find(gain => gain.abilityType === skill.getSkillType()))
  .forEach(skill => console.log(skill.getSkillType()))

console.log("\nunmapped spells")
spellsWithoutLevel
  .filter(spell => !gainSpecializationLevels.find(gain => gain.abilityType === spell.getSpellType()))
  .forEach(spell => console.log(spell.getSpellType()))

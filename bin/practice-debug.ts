import PracticeService from "../src/gameService/practiceService"
import ServiceBuilder from "../src/gameService/serviceBuilder"
import {Mob} from "../src/mob/model/mob"
import {RaceType} from "../src/mob/race/raceType"
import {SpecializationType} from "../src/mob/specialization/specializationType"
import MobBuilder from "../src/test/mobBuilder"

// arguments
const race = process.argv[2] as RaceType
const specialization = process.argv[3] as SpecializationType
const level = +process.argv[4]

// service & mob
const serviceBuilder = new ServiceBuilder()
const mob = new MobBuilder(new Mob(), serviceBuilder)
  .setLevel(level)
  .setRace(race)
  .setSpecialization(specialization)
  .build()
const practiceService = new PracticeService()
console.log(practiceService.generateOutputStatus(mob))

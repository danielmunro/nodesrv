import createAppContainer from "../src/app/factory/factory"
import {Mob} from "../src/mob/model/mob"
import {RaceType} from "../src/mob/race/enum/raceType"
import {SpecializationType} from "../src/mob/specialization/enum/specializationType"
import PracticeService from "../src/player/service/practiceService"
import {initializeConnection} from "../src/support/db/connection"

// arguments
const race = process.argv[2] as RaceType
const specialization = process.argv[3] as SpecializationType
const level = +process.argv[4]

console.log("debug", { race, specialization, level })

initializeConnection().then(async () => {
  const app = await createAppContainer()
  const specializationService = app.getSpecializationService()
  // service & mob
  const mob = new Mob()
  mob.raceType = race
  mob.specializationType = specialization
  mob.level = level
  specializationService.applyAllDefaults(mob)

  const practiceService = new PracticeService()
  console.log(practiceService.generateOutputStatus(mob))
  process.exit()
})

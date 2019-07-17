import {Environment} from "../src/app/enum/environment"
import createAppContainer from "../src/app/factory/factory"
import {createMob} from "../src/mob/factory/mobFactory"
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
  const app = await createAppContainer(
    process.env.STRIPE_API_KEY as string,
    process.env.STRIPE_PLAN_ID as string,
    Environment.Development)
  const specializationService = app.getSpecializationService()
  // service & mob
  const mob = createMob()
  mob.raceType = race
  mob.specializationType = specialization
  mob.level = level
  specializationService.applyAllDefaults(mob)

  const practiceService = new PracticeService()
  console.log(practiceService.generateOutputStatus(mob))
  process.exit()
})

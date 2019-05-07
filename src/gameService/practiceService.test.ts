import {createTestAppContainer} from "../inversify.config"
import {SpecializationType} from "../mob/specialization/specializationType"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import {PracticeMessages} from "./constants"
import PracticeService from "./practiceService"

let testRunner: TestRunner
const practiceService = new PracticeService()

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("practice service", () => {
  it.each([
    [SpecializationType.Warrior, PracticeMessages.Warrior],
    [SpecializationType.Ranger, PracticeMessages.Ranger],
    [SpecializationType.Mage, PracticeMessages.Mage],
    [SpecializationType.Cleric, PracticeMessages.Cleric],
  ])("generates accurate practice messages for a %s", (specialization: SpecializationType, message: string) => {
    // when
    const mob = testRunner.createMob()
      .setSpecialization(specialization)
      .get()

    // then
    expect(practiceService.generateOutputStatus(mob)).toBe(message)
  })
})

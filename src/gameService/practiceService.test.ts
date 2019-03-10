import {SpecializationType} from "../mob/specialization/specializationType"
import TestBuilder from "../test/testBuilder"
import PracticeService from "./practiceService"
import {PracticeMessages} from "./constants"

let testBuilder: TestBuilder
const practiceService = new PracticeService()

beforeEach(() => {
  testBuilder = new TestBuilder()
})

describe("practice service", () => {
  it.each([
    [SpecializationType.Warrior, PracticeMessages.Warrior],
    [SpecializationType.Ranger, PracticeMessages.Ranger],
    [SpecializationType.Mage, PracticeMessages.Mage],
    [SpecializationType.Cleric, PracticeMessages.Cleric],
  ])("generates accurate practice messages for a %s", (specialization: SpecializationType, message: string) => {
    // when
    const mob = testBuilder.withMob()
      .setSpecialization(specialization)
      .build()

    // then
    expect(practiceService.generateOutputStatus(mob)).toBe(message)
  })
})

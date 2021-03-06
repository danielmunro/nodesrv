import {createTestAppContainer} from "../../app/factory/testFactory"
import {PracticeMessages} from "../../gameService/constants"
import {SpecializationType} from "../../mob/specialization/enum/specializationType"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
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
  ])
  // @ts-ignore
  ("generates accurate practice messages for a %s", async (specialization: SpecializationType, message: string) => {
    // when
    const mob = (await testRunner.createMob())
      .setSpecialization(specialization)
      .get()

    // then
    expect(practiceService.generateOutputStatus(mob)).toBe(message)
  })
})

import {createTestAppContainer} from "../../../app/factory/testFactory"
import {SkillType} from "../../../mob/skill/skillType"
import {SpecializationType} from "../../../mob/specialization/enum/specializationType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import CreationService from "./creationService"

let testRunner: TestRunner
let creationService: CreationService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  creationService = app.get<CreationService>(Types.CreationService)
})

describe("creation service", () => {
  it("includes weapons in the list of available skills", async () => {
    // setup
    const player = (await testRunner.createPlayer()).get()

    // given
    player.sessionMob.specializationType = SpecializationType.Cleric

    // when
    const specializationLevels = creationService.getUnknownSkills(player.sessionMob)

    // then
    expect(specializationLevels.find(specializationLevel =>
      specializationLevel.abilityType === SkillType.Axe)).toBeDefined()
  })
})

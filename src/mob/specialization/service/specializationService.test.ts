import {createTestAppContainer} from "../../../app/factory/testFactory"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {SkillType} from "../../skill/skillType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "./specializationService"

let testRunner: TestRunner
let specializationService: SpecializationService
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  const app = await createTestAppContainer()
  specializationService = app.get<SpecializationService>(Types.SpecializationService)
  testRunner = app.get<TestRunner>(Types.TestRunner)
  playerBuilder = await testRunner.createPlayer()
})

describe("specialization service", () => {
  it.each([
    SpecializationType.Warrior,
    SpecializationType.Ranger,
    SpecializationType.Mage,
    SpecializationType.Cleric,
  ])("applies skills and spells to a %s", specializationType => {
    // when
    const mobBuilder = playerBuilder.getMobBuilder()
    mobBuilder.setSpecialization(specializationType)
    const mob = mobBuilder.get()

    // then
    expect(mob.skills.length + mob.spells.length).toBeGreaterThan(0)
  })

  it("shows available skills", () => {
    // setup
    const mobBuilder = playerBuilder.getMobBuilder()

    // given
    mobBuilder.setSpecialization(SpecializationType.Mage)

    // when
    const availableSkills = specializationService.getAvailableSkills(mobBuilder.get())

    // then
    expect(availableSkills.length).toBeGreaterThan(0)
  })

  it("shows unavailable skills", () => {
    // setup
    const mobBuilder = playerBuilder.getMobBuilder()
    mobBuilder.get().specializationType = SpecializationType.Mage

    // given
    const unavailableSkills = specializationService.getUnavailableSkills(mobBuilder.get())
    mobBuilder.withSkill(SkillType.Dagger)

    // when
    const newUnavailableSkills = specializationService.getUnavailableSkills(mobBuilder.get())

    // then
    expect(newUnavailableSkills.length).toBe(unavailableSkills.length + 1)
  })
})

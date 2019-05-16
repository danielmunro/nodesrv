import {createTestAppContainer} from "../../../app/testFactory"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {SpecializationType} from "../enum/specializationType"

let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob()
})

describe("specialization service", () => {
  it.each([
    SpecializationType.Warrior,
    SpecializationType.Ranger,
    SpecializationType.Mage,
    SpecializationType.Cleric,
  ])("applies skills and spells to a %s", specializationType => {
    // when
    mobBuilder.setSpecialization(specializationType)

    // then
    const mob = mobBuilder.get()
    expect(mob.skills.length + mob.spells.length).toBeGreaterThan(0)
  })
})

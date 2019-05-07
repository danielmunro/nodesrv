import {DamageType} from "../damage/damageType"
import {createTestAppContainer} from "../inversify.config"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import DamageService from "./damageService"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("damage service", () => {
  it("reports the damage type of a mob that is unequipped", () => {
    // when
    const mobBuilder = testRunner.createMob()

    // then
    expect(new DamageService(mobBuilder.mob).getDamageType()).toBe(DamageType.Bash)
  })

  it("reports the damage type of a mob that is equipped", () => {
    // when
    const mobBuilder = testRunner.createMob()
    mobBuilder.equip(testRunner.createWeapon()
      .asAxe()
      .build())

    // then
    expect(new DamageService(mobBuilder.mob).getDamageType()).toBe(DamageType.Slash)
  })
})

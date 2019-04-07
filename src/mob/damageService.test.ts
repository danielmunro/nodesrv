import {DamageType} from "../damage/damageType"
import TestBuilder from "../support/test/testBuilder"
import DamageService from "./damageService"

describe("damage service", () => {
  it("reports the damage type of a mob that is unequipped", () => {
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()

    expect(new DamageService(mobBuilder.mob).getDamageType()).toBe(DamageType.Bash)
  })

  it("reports the damage type of a mob that is equipped", () => {
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    testBuilder.withWeapon()
      .asAxe()
      .equipToMobBuilder(mobBuilder)
      .build()

    expect(new DamageService(mobBuilder.mob).getDamageType()).toBe(DamageType.Slash)
  })
})

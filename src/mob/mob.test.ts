import { getTestMob } from "../test/mob"
import TestBuilder from "../test/testBuilder"
import appetite from "./race/appetite"

describe("mob model", () => {
  it("should not exceed its max appetite when eating", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    food.hunger = 10
    const mob = playerBuilder.player.sessionMob
    const maxAppetite = appetite(mob.race)

    // when
    mob.playerMob.eat(food)

    // then
    expect(mob.playerMob.hunger).toBe(maxAppetite)
  })

  it("should get a mob of requested level", () => {
    // given
    const expectedLevel = 25

    // when
    const mob = getTestMob("foo", expectedLevel)

    // then
    expect(mob.level).toBe(expectedLevel)
  })

  it("should be able to normalize vitals", () => {
    // setup
    const mob = getTestMob()
    const combined = mob.getCombinedAttributes()

    // given
    mob.vitals.hp = 1000
    mob.vitals.mana = 1000
    mob.vitals.mv = 1000

    // when
    mob.normalizeVitals()

    // then
    expect(mob.vitals.hp).toBe(combined.vitals.hp)
    expect(mob.vitals.mana).toBe(combined.vitals.mana)
    expect(mob.vitals.mv).toBe(combined.vitals.mv)
  })

  it("should normalize vitals after regen", () => {
    // setup
    const mob = getTestMob()
    const combined = mob.getCombinedAttributes()

    // given
    mob.regen()

    // then
    expect(mob.vitals.hp).toBe(combined.vitals.hp)
    expect(mob.vitals.mana).toBe(combined.vitals.mana)
    expect(mob.vitals.mv).toBe(combined.vitals.mv)
  })
})

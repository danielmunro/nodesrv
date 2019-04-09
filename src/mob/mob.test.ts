import {Tick} from "../server/observers/tick"
import { getTestMob } from "../support/test/mob"
import TestBuilder from "../support/test/testBuilder"

describe("mob model", () => {
  it("should not exceed its max appetite when eating", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const food = testBuilder.withItem()
      .asFood()
      .addToPlayerBuilder(playerBuilder)
      .build()
    food.hunger = 10
    const mob = playerBuilder.player.sessionMob
    const maxAppetite = mob.race().appetite

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
    const combined = mob.attribute().combine()

    // given
    mob.vitals.hp = 1000
    mob.vitals.mana = 1000
    mob.vitals.mv = 1000

    // when
    mob.attribute().normalize()

    // then
    expect(mob.vitals.hp).toBe(combined.vitals.hp)
    expect(mob.vitals.mana).toBe(combined.vitals.mana)
    expect(mob.vitals.mv).toBe(combined.vitals.mv)
  })

  it("should normalize vitals after regen", () => {
    // setup
    const mob = getTestMob()
    const combined = mob.attribute().combine()

    // given
    Tick.regen(mob)

    // then
    expect(mob.vitals.hp).toBe(combined.vitals.hp)
    expect(mob.vitals.mana).toBe(combined.vitals.mana)
    expect(mob.vitals.mv).toBe(combined.vitals.mv)
  })

  it("should describe if it's a merchant", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mob = testBuilder.withMob().mob
    const merchant = testBuilder.withMob().asMerchant().mob
    const player = (await testBuilder.withPlayer()).player

    // expect
    expect(mob.isMerchant()).toBeFalsy()
    expect(merchant.isMerchant()).toBeTruthy()
    expect(player.sessionMob.isMerchant()).toBeFalsy()
  })
})

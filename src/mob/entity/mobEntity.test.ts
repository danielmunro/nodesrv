import {createTestAppContainer} from "../../app/factory/testFactory"
import {Tick} from "../../server/observers/tick"
import { getTestMob } from "../../support/test/mob"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("mob entity", () => {
  it("cannot exceed its max appetite when eating", async () => {
    // given
    const playerBuilder = testRunner.createPlayer()
    const food = testRunner.createItem()
      .asFood()
      .build()
    playerBuilder.addItem(food)
    food.hunger = 10
    const mob = playerBuilder.player.sessionMob
    const maxAppetite = mob.race().appetite

    // when
    mob.playerMob.eat(food)

    // then
    expect(mob.playerMob.hunger).toBe(maxAppetite)
  })

  it("gets a mob of requested level", () => {
    // given
    const expectedLevel = 25

    // when
    const mob = getTestMob("foo", expectedLevel)

    // then
    expect(mob.level).toBe(expectedLevel)
  })

  it("can normalize vitals", () => {
    // setup
    const mob = getTestMob()
    const combined = mob.attribute().combine()

    // given
    mob.hp = 1000
    mob.mana = 1000
    mob.mv = 1000

    // when
    mob.attribute().normalize()

    // then
    expect(mob.hp).toBe(combined.hp)
    expect(mob.mana).toBe(combined.mana)
    expect(mob.mv).toBe(combined.mv)
  })

  it("normalizes vitals after regen", () => {
    // setup
    const mob = getTestMob()
    const combined = mob.attribute().combine()

    // given
    Tick.regen(mob, 2)

    // then
    expect(mob.hp).toBe(combined.hp)
    expect(mob.mana).toBe(combined.mana)
    expect(mob.mv).toBe(combined.mv)
  })

  it("describes if it's a merchant", async () => {
    // given
    const mob = testRunner.createMob().get()
    const merchant = testRunner.createMob().asMerchant().get()
    const player = testRunner.createPlayer().player

    // expect
    expect(mob.isMerchant()).toBeFalsy()
    expect(merchant.isMerchant()).toBeTruthy()
    expect(player.sessionMob.isMerchant()).toBeFalsy()
  })
})

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
    const expectedLevel = 25
    const mob = getTestMob("foo", expectedLevel)

    expect(mob.level).toBe(expectedLevel)
  })
})

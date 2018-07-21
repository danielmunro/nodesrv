import TestBuilder from "../test/testBuilder"
import appetite from "./race/appetite"

describe("mob model", () => {
  it("should not exceed its max appetite when eating", () => {
    // given
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    const food = mobBuilder.withFood()
    food.nourishment = 10
    const mob = mobBuilder.mob
    const maxAppetite = appetite(mob.race)

    // when
    mob.eat(food)

    // then
    expect(mob.hunger).toBe(maxAppetite)
  })
})

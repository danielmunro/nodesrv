import { newAttributes, newHitroll, newStartingVitals, newStats } from "../../attributes/factory"
import Hitroll from "../../attributes/model/hitroll"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { newMob } from "../factory"
import { Mob } from "../model/mob"
import { Race } from "../race/race"
import { Fight } from "./fight"

function newFightingMob(name: string, hitroll: Hitroll): Mob {
  return newMob(
    name,
    "a test fixture",
    Race.Human,
    newStartingVitals(),
    newAttributes(newStartingVitals(), newStats(0, 0, 0, 0, 0, 0), hitroll))
}

describe("fight", () => {
  it("getOpponentFor should return null for mobs not in the fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobFactory = name => newFightingMob(name, newHitroll(1, 1))
    const aggressor = mobFactory("aggressor")
    const target = mobFactory("target")
    const bystander = mobFactory("collateral")

    // when
    const fight = new Fight(await testBuilder.getService(), aggressor, target, getTestRoom())

    // then
    expect(fight.getOpponentFor(bystander)).toBeNull()
  })

  it("should stop when hit points reach zero", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const aggressor = testBuilder.withMob().mob
    const target = testBuilder.withMob().mob

    // WHEN - a fight is allowed to complete
    const fight = await testBuilder.fight(target)
    expect(fight.isInProgress()).toBe(true)

    while (fight.isInProgress()) {
      await fight.round()
    }

    // THEN - a winner will have > 1 hp and the other mob is dead
    if (fight.getWinner() === aggressor) {
      expect(aggressor.vitals.hp).toBeGreaterThanOrEqual(0)
      expect(target.vitals.hp).toBeLessThanOrEqual(0)
      return
    }

    expect(target.vitals.hp).toBeGreaterThanOrEqual(0)
    expect(aggressor.vitals.hp).toBeLessThanOrEqual(0)
  })
})

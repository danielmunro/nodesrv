import { newAttributes, newHitroll, newStartingVitals, newStats } from "../attributes/factory"
import Hitroll from "../attributes/model/hitroll"
import { newMob } from "./factory"
import { Fight } from "./fight"
import { Mob } from "./model/mob"
import { Race } from "./race/race"

function newFightingMob(name: string, hitroll: Hitroll): Mob {
  return newMob(
    name,
    "a test fixture",
    Race.Human,
    newStartingVitals(),
    newAttributes(newStartingVitals(), newStats(0, 0, 0, 0, 0, 0), hitroll))
}

describe("fight", () => {
  it("should stop when hit points reach zero", () => {
    // SETUP
    const aggressor = newFightingMob("aggressor", newHitroll(2, 3))
    const target = newFightingMob("target", newHitroll(1, 1))

    // WHEN - a fight is allowed to complete
    const fight = new Fight(aggressor, target)
    expect(fight.isInProgress()).toBe(true)

    while (fight.isInProgress()) {
      fight.round()
    }

    // THEN - a winner will have > 1 hp and the other mob is dead
    if (fight.getWinner() === aggressor) {
      expect(aggressor.vitals.hp).toBeGreaterThanOrEqual(1)
      expect(target.vitals.hp).toBeLessThanOrEqual(0)
      return
    }

    expect(target.vitals.hp).toBeGreaterThanOrEqual(1)
    expect(aggressor.vitals.hp).toBeLessThanOrEqual(0)
  })
})

import { newAttributes, newHitroll, newStats, newVitals } from "../attributes/factory"
import { newMob } from "./factory"
import { Fight } from "./fight"
import { Race } from "./race/race"

describe("fight", () => {
  it("should stop when hit points reach zero", () => {
    const v1 = newVitals(20, 100, 100)
    const v2 = newVitals(20, 100, 100)
    const aggressor = newMob(
      "agressor",
      "agressor",
      Race.Human,
      v1,
      newAttributes(newVitals(20, 100, 100), newStats(0, 0, 0, 0, 0, 0), newHitroll(2, 3)))
    const target = newMob(
      "target",
      "target",
      Race.Human,
      v2,
      newAttributes(newVitals(20, 100, 100), newStats(0, 0, 0, 0, 0, 0), newHitroll(1, 1)))
    const fight = new Fight(aggressor, target)
    expect(fight.isInProgress()).toBe(true)
    fight.round()
    expect(aggressor.vitals.hp).toBeLessThan(20)
    expect(target.vitals.hp).toBeLessThan(20)
    while (fight.isInProgress()) {
      fight.round()
    }

    if (fight.getWinner() === aggressor) {
      expect(aggressor.vitals.hp).toBeGreaterThanOrEqual(1)
      expect(target.vitals.hp).toBeLessThanOrEqual(0)
      return
    }

    expect(target.vitals.hp).toBeGreaterThanOrEqual(1)
    expect(aggressor.vitals.hp).toBeLessThanOrEqual(0)
  })
})

import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { Fight } from "./fight"
import {Round} from "./round"

describe("fight", () => {
  it("getOpponentFor should return null for mobs not in the fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobFactory = (name: string) => testBuilder.withMob(name).mob
    const aggressor = mobFactory("aggressor")
    const target = mobFactory("target")
    const bystander = mobFactory("collateral")
    const service = await testBuilder.getService()

    // when
    const fight = new Fight(
      service.eventService,
      aggressor,
      target,
      getTestRoom())

    // then
    expect(fight.getOpponentFor(bystander)).toBeUndefined()
  })

  it("should stop when hit points reach zero", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const aggressor = testBuilder.withMob().mob
    const target = testBuilder.withMob().mob

    // WHEN - a fight is allowed to complete
    const fight = await testBuilder.fight(target)
    expect(fight.isInProgress()).toBe(true)
    let round: Round = await fight.round()

    while (fight.isInProgress()) {
      round = await fight.round()
    }

    // THEN - a winner will have > 1 hp and the other mob is dead
    if (round.getWinner() === aggressor) {
      expect(aggressor.vitals.hp).toBeGreaterThanOrEqual(0)
      expect(target.vitals.hp).toBeLessThanOrEqual(0)
      return
    }

    expect(target.vitals.hp).toBeGreaterThanOrEqual(0)
    expect(aggressor.vitals.hp).toBeLessThanOrEqual(0)
  })
})

import { getTestRoom } from "../../support/test/room"
import TestBuilder from "../../support/test/testBuilder"
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

    // when - a fight has allowed to complete
    const fight = await testBuilder.fight(target)
    expect(fight.isInProgress()).toBe(true)
    let round: Round = await fight.round()

    while (fight.isInProgress()) {
      round = await fight.round()
    }

    // then - a winner will have > 1 hp and the other mob has dead
    if (round.getWinner() === aggressor) {
      expect(aggressor.vitals.hp).toBeGreaterThanOrEqual(0)
      expect(target.vitals.hp).toBeLessThanOrEqual(0)
      return
    }

    expect(target.vitals.hp).toBeGreaterThanOrEqual(0)
    expect(aggressor.vitals.hp).toBeLessThanOrEqual(0)
  })

  it("players gain experience after killing a mob", async () => {
    // setup
    const experienceToLevel = 1000
    const testBuilder = new TestBuilder()
    const aggressor = await testBuilder.withPlayer()

    // given
    aggressor.getMob().playerMob.experienceToLevel = experienceToLevel

    // when
    const fight = await testBuilder.fight()
    while (fight.isInProgress()) {
      aggressor.setHp(20)
      await fight.round()
    }

    // then
    expect(aggressor.getMob().playerMob.experience).toBeGreaterThan(0)
    expect(aggressor.getMob().playerMob.experienceToLevel).toBeLessThan(experienceToLevel)
  })
})

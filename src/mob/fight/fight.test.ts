import {createTestAppContainer} from "../../app/factory/testFactory"
import EventService from "../../event/service/eventService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { Fight } from "./fight"
import {Round} from "./round"

let testRunner: TestRunner
let eventService: EventService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventService = app.get<EventService>(Types.EventService)
})

describe("fight", () => {
  it("getOpponentFor should return null for mobs not in the fight", async () => {
    // setup
    const aggressor = (await testRunner.createMob()).get()
    const target = (await testRunner.createMob()).get()
    const bystander = (await testRunner.createMob()).get()

    // when
    const fight = new Fight(
      eventService,
      aggressor,
      target,
      testRunner.getStartRoom().get())

    // then
    expect(() => fight.getOpponentFor(bystander)).toThrowError()
  })

  it("should stop when hit points reach zero", async () => {
    // setup
    const aggressor = (await testRunner.createMob()).get()
    const target = (await testRunner.createMob()).get()

    // when - a fight has allowed to complete
    const fight = await testRunner.fight(target)
    expect(fight.isInProgress()).toBe(true)
    let round: Round = await fight.round()

    while (fight.isInProgress()) {
      round = await fight.round()
    }

    // then - a winner will have > 1 hp and the other mob has dead
    if (round.getWinner() === aggressor) {
      expect(aggressor.hp).toBeGreaterThanOrEqual(0)
      expect(target.hp).toBeLessThanOrEqual(0)
      return
    }

    expect(target.hp).toBeGreaterThanOrEqual(0)
    expect(aggressor.hp).toBeLessThanOrEqual(0)
  })

  it("players gain experience after killing a mob", async () => {
    // setup
    const experienceToLevel = 1000
    const aggressor = await testRunner.createPlayer()

    // given
    aggressor.getMob().playerMob.experienceToLevel = experienceToLevel

    // when
    const fight = await testRunner.fight()
    while (fight.isInProgress()) {
      aggressor.setHp(20)
      await fight.round()
    }

    // then
    expect(aggressor.getMob().playerMob.experience).toBeGreaterThan(0)
    expect(aggressor.getMob().playerMob.experienceToLevel).toBeLessThan(experienceToLevel)
  })

  it("truthy sanity check for isP2P", async () => {
    // given
    await testRunner.createPlayer()
    const player = await testRunner.createPlayer()

    // when
    const fight = await testRunner.fight(player.getMob())

    // then
    expect(fight.isP2P()).toBeTruthy()
  })

  it("falsy sanity check for isP2P", async () => {
    // given
    await testRunner.createPlayer()
    const mob = await testRunner.createMob()

    // when
    const fight = await testRunner.fight(mob.get())

    // then
    expect(fight.isP2P()).toBeFalsy()
  })

  it("another falsy sanity check for isP2P", async () => {
    // given
    await testRunner.createMob()
    const mob = await testRunner.createMob()

    // when
    const fight = await testRunner.fight(mob.get())

    // then
    expect(fight.isP2P()).toBeFalsy()
  })
})

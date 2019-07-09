import {createTestAppContainer} from "../../app/factory/testFactory"
import EventService from "../../event/service/eventService"
import KafkaService from "../../kafka/kafkaService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { Fight } from "./fight"
import {Round} from "./round"

let testRunner: TestRunner
let kafkaService: KafkaService
let eventService: EventService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  kafkaService = app.get<KafkaService>(Types.KafkaService)
  eventService = app.get<EventService>(Types.EventService)
})

describe("fight", () => {
  it("getOpponentFor should return null for mobs not in the fight", async () => {
    // setup
    const aggressor = testRunner.createMob().get()
    const target = testRunner.createMob().get()
    const bystander = testRunner.createMob().get()

    // when
    const fight = new Fight(
      kafkaService,
      eventService,
      aggressor,
      target,
      testRunner.getStartRoom().get())

    // then
    expect(fight.getOpponentFor(bystander)).toBeUndefined()
  })

  it("should stop when hit points reach zero", async () => {
    // setup
    const aggressor = testRunner.createMob().get()
    const target = testRunner.createMob().get()

    // when - a fight has allowed to complete
    const fight = testRunner.fight(target)
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
    const aggressor = testRunner.createPlayer()

    // given
    aggressor.getMob().playerMob.experienceToLevel = experienceToLevel

    // when
    const fight = testRunner.fight()
    while (fight.isInProgress()) {
      aggressor.setHp(20)
      await fight.round()
    }

    // then
    expect(aggressor.getMob().playerMob.experience).toBeGreaterThan(0)
    expect(aggressor.getMob().playerMob.experienceToLevel).toBeLessThan(experienceToLevel)
  })

  it("truthy sanity check for isP2P", () => {
    // given
    testRunner.createPlayer()
    const player = testRunner.createPlayer()

    // when
    const fight = testRunner.fight(player.getMob())

    // then
    expect(fight.isP2P()).toBeTruthy()
  })

  it("increments kills and deaths for P2P fights", async () => {
    // given
    const player1 = testRunner.createPlayer().get()
    const player2 = testRunner.createPlayer().get()
    const fight = testRunner.fight(player2.sessionMob)

    // when
    while (fight.isInProgress()) {
      player1.sessionMob.hp = 20
      await fight.round()
    }

    // then
    expect(player1.kills).toBe(1)
    expect(player1.deaths).toBe(0)
    expect(player2.kills).toBe(0)
    expect(player2.deaths).toBe(1)
  })

  it("falsy sanity check for isP2P", () => {
    // given
    testRunner.createPlayer()
    const mob = testRunner.createMob()

    // when
    const fight = testRunner.fight(mob.get())

    // then
    expect(fight.isP2P()).toBeFalsy()
  })

  it("another falsy sanity check for isP2P", () => {
    // given
    testRunner.createMob()
    const mob = testRunner.createMob()

    // when
    const fight = testRunner.fight(mob.get())

    // then
    expect(fight.isP2P()).toBeFalsy()
  })
})

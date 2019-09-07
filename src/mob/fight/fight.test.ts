import {createTestAppContainer} from "../../app/factory/testFactory"
import EventService from "../../event/service/eventService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {MobEntity} from "../entity/mobEntity"
import { Fight } from "./fight"
import {Round} from "./round"

let testRunner: TestRunner
let eventService: EventService
let aggressor: MobEntity
let target: MobEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventService = app.get<EventService>(Types.EventService)
  aggressor = (await testRunner.createMob()).get()
  target = (await testRunner.createMob()).get()
})

describe("fight", () => {
  it("getOpponentFor should return null for mobs not in the fight", async () => {
    // setup
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
    const player = await testRunner.createPlayer()

    // given
    player.getMob().playerMob.experienceToLevel = experienceToLevel

    // when
    const fight = await testRunner.fightAs(player.getMob(), target)
    while (fight.isInProgress()) {
      player.setHp(20)
      await fight.round()
    }

    // then
    expect(player.getMob().playerMob.experience).toBeGreaterThan(0)
    expect(player.getMob().playerMob.experienceToLevel).toBeLessThan(experienceToLevel)
  })

  it("truthy sanity check for isP2P", async () => {
    // given
    const p1 = await testRunner.createPlayer()
    const p2 = await testRunner.createPlayer()

    // when
    const fight = await testRunner.fightAs(p1.getMob(), p2.getMob())

    // then
    expect(fight.isP2P()).toBeTruthy()
  })

  it("falsy sanity check for isP2P", async () => {
    // given
    const player = await testRunner.createPlayer()

    // when
    const fight = await testRunner.fightAs(player.getMob(), target)

    // then
    expect(fight.isP2P()).toBeFalsy()
  })

  it("another falsy sanity check for isP2P", async () => {
    // given
    const player = await testRunner.createPlayer()

    // when
    const fight = await testRunner.fightAs(aggressor, player.getMob())

    // then
    expect(fight.isP2P()).toBeFalsy()
  })

  it("transfers items to a corpse when death occurs", async () => {
    // given
    target.inventory.addItem(testRunner.createItem().asShield().build())
    const fight = await testRunner.fight(target)

    // when
    while (fight.isInProgress()) {
      aggressor.hp = 20
      await fight.round()
    }

    // then
    const room = testRunner.getStartRoom().get()
    expect(room.inventory.items).toHaveLength(1)

    const item = room.inventory.items[0]
    expect(item.container.inventory.items).toHaveLength(1)
  })

  it.each([
    [true, 0, 1],
    [false, 1, 0],
  ])(
    "respects a player's auto loot option when killing a mob",
    // @ts-ignore
    async (autoloot: boolean, corpseItemCount: number, playerItemCount: number) => {
    // setup
    const player = await testRunner.createPlayer()
    player.getMob().playerMob.autoLoot = autoloot

    // given
    target.inventory.addItem(testRunner.createItem().asShield().build())
    const fight = await testRunner.fightAs(player.getMob(), target)

    // when
    while (fight.isInProgress()) {
      player.setHp(20)
      await fight.round()
    }

    // then
    const room = testRunner.getStartRoom().get()
    expect(room.inventory.items).toHaveLength(1)

    const item = room.inventory.items[0]
    expect(item.container.inventory.items).toHaveLength(corpseItemCount)
    expect(player.getItems()).toHaveLength(playerItemCount)
  })
})

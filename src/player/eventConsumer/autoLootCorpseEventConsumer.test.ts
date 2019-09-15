import {createTestAppContainer} from "../../app/factory/testFactory"
import {createDeathEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import {MobEntity} from "../../mob/entity/mobEntity"
import Death from "../../mob/fight/death"
import MobService from "../../mob/service/mobService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {PlayerEntity} from "../entity/playerEntity"
import AutoLootCorpseEventConsumer from "./autoLootCorpseEventConsumer"

let testRunner: TestRunner
let consumer: AutoLootCorpseEventConsumer
let mobService: MobService
let killer: PlayerEntity
let killed: MobEntity
const goldAmount = 10

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
  consumer = new AutoLootCorpseEventConsumer(
    app.get<EventService>(Types.EventService), app.get<MobService>(Types.MobService))
  killer = (await testRunner.createPlayer()).get()
  killed = (await testRunner.createMob()).setGold(goldAmount).get()
})

describe("auto loot corpse event consumer", () => {
  it("loots gold", async () => {
    // given
    const death = new Death(killed, killer.sessionMob)

    // when
    await consumer.consume(createDeathEvent(death))

    // then
    expect(killer.sessionMob.gold).toBe(goldAmount)
    expect(killed.gold).toBe(0)
  })

  it("splits loot gold between all group members in the same room", async () => {
    // setup
    const follow1 = (await testRunner.createMob()).get()
    mobService.addFollow(killer.sessionMob, follow1)
    const follow2 = (await testRunner.createMob()).get()
    mobService.addFollow(killer.sessionMob, follow2)
    const follow3 = (await testRunner.createMob()).get()
    mobService.addFollow(killer.sessionMob, follow3)
    const differentRoom = testRunner.createRoom().get()
    await mobService.updateMobLocation(follow3, differentRoom)

    // given
    const death = new Death(killed, killer.sessionMob)

    // when
    await consumer.consume(createDeathEvent(death))

    // then
    expect(killer.sessionMob.gold).toBe(goldAmount / 3)
    expect(follow1.gold).toBe(goldAmount / 3)
    expect(follow2.gold).toBe(goldAmount / 3)
    expect(follow3.gold).toBe(0)
  })
})

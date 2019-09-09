import {createTestAppContainer} from "../../app/factory/testFactory"
import {createDeathEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import {ItemEntity} from "../../item/entity/itemEntity"
import Death from "../../mob/fight/death"
import {RoomEntity} from "../../room/entity/roomEntity"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {PlayerEntity} from "../entity/playerEntity"
import AutoSacCorpseEventConsumer from "./autoSacCorpseEventConsumer"

let testRunner: TestRunner
let consumer: AutoSacCorpseEventConsumer
let death: Death
let corpse: ItemEntity
let startRoom: RoomEntity
let player: PlayerEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  player = (await testRunner.createPlayer()).get()
  const target = await testRunner.createMob()
  startRoom = testRunner.getStartRoom().get()
  death = new Death(
    target.get(),
    startRoom,
    player.sessionMob)
  corpse = death.createCorpse()
  consumer = new AutoSacCorpseEventConsumer(app.get<EventService>(Types.EventService))
  startRoom.inventory.addItem(corpse)
})

describe("auto sac corpse event consumer", () => {
  it("sacrifices a corpse if the player attributes say so", async () => {
    // when
    await consumer.consume(createDeathEvent(death, corpse))

    // then
    expect(startRoom.inventory.items).toHaveLength(0)
  })

  it("does not sacrifice a corpse if autosac is off", async () => {
    // given
    player.sessionMob.playerMob.autoSac = false

    // when
    await consumer.consume(createDeathEvent(death, corpse))

    // then
    expect(startRoom.inventory.items).toHaveLength(1)
  })
})

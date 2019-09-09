import {createTestAppContainer} from "../../app/factory/testFactory"
import {createDeathEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import Death from "../../mob/fight/death"
import LocationService from "../../mob/service/locationService"
import {RoomEntity} from "../../room/entity/roomEntity"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {PlayerEntity} from "../entity/playerEntity"
import AutoSacCorpseEventConsumer from "./autoSacCorpseEventConsumer"

let testRunner: TestRunner
let consumer: AutoSacCorpseEventConsumer
let death: Death
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
    player.sessionMob)
  consumer = new AutoSacCorpseEventConsumer(
    app.get<EventService>(Types.EventService),
    app.get<LocationService>(Types.LocationService))
  startRoom.inventory.addItem(death.corpse)
})

describe("auto sac corpse event consumer", () => {
  it("sacrifices a corpse if the player's autosac says so", async () => {
    // when
    await consumer.consume(createDeathEvent(death))

    // then
    expect(startRoom.inventory.items).toHaveLength(0)
  })

  it("does not sacrifice a corpse if autosac is off", async () => {
    // given
    player.sessionMob.playerMob.autoSac = false

    // when
    await consumer.consume(createDeathEvent(death))

    // then
    expect(startRoom.inventory.items).toHaveLength(1)
  })
})

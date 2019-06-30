import {createTestAppContainer} from "../../app/factory/testFactory"
import {createMobMoveEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {Fight} from "../fight/fight"
import MobService from "../service/mobService"

let testRunner: TestRunner
let mobService: MobService
let eventService: EventService
let room: RoomEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
  eventService = app.get<EventService>(Types.EventService)
  room = app.get<RoomEntity>(Types.StartRoom)
})

describe("aggressive mob event consumer", () => {
  it("arriving in a room with an aggressive mob should trigger a fight", async () => {
    // setup
    const player = testRunner.createPlayer()

    // given
    testRunner.createMob().setAggressive()

    // when
    await eventService.publish(
      createMobMoveEvent(player.getMob(), room, room, 1, Direction.Noop))

    // then
    const fight = mobService.findFightForMob(player.getMob())
    expect(fight).toBeDefined()
    expect(fight).toBeInstanceOf(Fight)
  })

  it("don't attack non-players", async () => {
    // setup
    const mob1 = testRunner.createMob().get()

    // given
    testRunner.createMob().setAggressive()

    // when
    await eventService.publish(createMobMoveEvent(mob1, room, room, 1, Direction.Noop))

    // then
    const fight = mobService.findFightForMob(mob1)
    expect(fight).not.toBeDefined()
  })

  it("if an aggressive mob has a lower level than the target, don't initiate an attack", async () => {
    // setup
    const player = testRunner.createPlayer()

    // given
    const mob2 = testRunner.createMob().setAggressive().get()
    player.setLevel(mob2.level + 1)

    // when
    await eventService.publish(
      createMobMoveEvent(player.getMob(), room, room, 1, Direction.Noop))

    // then
    const fight = mobService.findFightForMob(player.getMob())
    expect(fight).not.toBeDefined()
  })
})

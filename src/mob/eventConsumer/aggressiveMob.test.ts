import {createTestAppContainer} from "../../app/testFactory"
import EventService from "../../event/eventService"
import {Direction} from "../../room/constants"
import {Room} from "../../room/model/room"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import MobMoveEvent from "../event/mobMoveEvent"
import {Fight} from "../fight/fight"
import MobService from "../service/mobService"

let testRunner: TestRunner
let mobService: MobService
let eventService: EventService
let room: Room

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
  eventService = app.get<EventService>(Types.EventService)
  room = app.get<Room>(Types.StartRoom)
})

describe("aggressive mob event consumer", () => {
  it("arriving in a room with an aggressive mob should trigger a fight", async () => {
    // setup
    const player = testRunner.createPlayer()

    // given
    testRunner.createMob().setAggressive()

    // when
    await eventService.publish(
      new MobMoveEvent(player.getMob(), room, room, Direction.Noop))

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
    await eventService.publish(new MobMoveEvent(mob1, room, room, Direction.Noop))

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
      new MobMoveEvent(player.getMob(), room, room, Direction.Noop))

    // then
    const fight = mobService.findFightForMob(player.getMob())
    expect(fight).not.toBeDefined()
  })
})

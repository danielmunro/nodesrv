import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import {createFightEvent} from "../../event/factory"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import LocationService from "../service/locationService"
import MobService from "../service/mobService"
import Wimpy from "./wimpy"

describe("wimpy event consumer", () => {
  it("causes a weak mob to flee", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const room1 = testRunner.getStartRoom()
    const room2 = testRunner.createRoom()
    const mob = testRunner.createMob().get()
    const target = testRunner.createMob().get()
    const fight = testRunner.fight(target)
    const wimpy = app.get<EventConsumer[]>(Types.EventConsumerTable).find(eventConsumer =>
      eventConsumer instanceof Wimpy) as Wimpy

    // given
    target.traits.wimpy = true
    target.vitals.hp = 1

    // when
    let eventResponse: EventResponseStatus = EventResponseStatus.None
    while (eventResponse !== EventResponseStatus.Satisfied) {
      eventResponse = (await wimpy.consume(createFightEvent(EventType.AttackRound, mob, fight))).status
    }

    // then
    const locationService = app.get<LocationService>(Types.LocationService)
    expect(locationService.getRoomForMob(mob)).toBe(room1.get())
    expect(locationService.getRoomForMob(target)).toBe(room2.get())

    // and
    const mobService = app.get<MobService>(Types.MobService)
    mobService.filterCompleteFights()
    expect(mobService.findFight(f => f === fight)).toBeUndefined()
  })
})

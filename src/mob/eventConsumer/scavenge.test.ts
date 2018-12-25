import MobEvent from "../../event/event/mobEvent"
import {EventType} from "../../event/eventType"
import TestBuilder from "../../test/testBuilder"
import Scavenge from "./scavenge"

describe("scavenge", () => {
  it("scavengers should scavenge items on the ground", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const roomBuilder = testBuilder.withRoom()
    const mob = testBuilder.withMob().mob
    mob.traits.scavenger = true
    roomBuilder.withHelmetEq()
    const service = await testBuilder.getService()

    // and -- hack timeout to 0 ms
    const scavenge = service.eventService.eventConsumers.find(eventConsumer => eventConsumer instanceof Scavenge)
    scavenge.scavengeTimeoutMS = 0
    const itemService = service.itemService

    // when
    service.publishEvent(new MobEvent(EventType.MobArrived, mob, roomBuilder.room))

    // then
    return setTimeout(() => {
      expect(itemService.findAllByInventory(mob.inventory)).toHaveLength(1)
      expect(itemService.findAllByInventory(roomBuilder.room.inventory)).toHaveLength(0)
    }, 0)
  })
})

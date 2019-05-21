import {createTestAppContainer} from "../../app/factory/testFactory"
import EventConsumer from "../../event/eventConsumer"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Scavenge from "./scavenge"

describe("scavenge", () => {
  it("scavengers should scavenge items on the ground", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const room = testRunner.getStartRoom()
    const mob = testRunner.createMob().get()
    const scavenge = app.get<EventConsumer[]>(Types.EventConsumerTable).find(eventConsumer =>
      eventConsumer instanceof Scavenge) as Scavenge

    // given
    mob.traits.scavenger = true
    room.addItem(testRunner.createItem()
      .asHelmet()
      .build())

    // when
    scavenge.scavenge(mob)

    // then
    expect(mob.inventory.items).toHaveLength(1)
    expect(room.getItemCount()).toBe(0)
  })
})

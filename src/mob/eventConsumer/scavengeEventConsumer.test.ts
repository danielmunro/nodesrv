import {createTestAppContainer} from "../../app/factory/testFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import ScavengeEventConsumer from "./scavengeEventConsumer"

describe("scavenge", () => {
  it("scavengers should scavenge items on the ground", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const room = testRunner.getStartRoom()
    const mob = (await testRunner.createMob()).get()
    const scavenge = app.get<EventConsumer[]>(Types.EventConsumerTable).find(eventConsumer =>
      eventConsumer instanceof ScavengeEventConsumer) as ScavengeEventConsumer

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

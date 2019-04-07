import {EventType} from "../../event/eventType"
import {getTestMob} from "../../support/test/mob"
import TestBuilder from "../../support/test/testBuilder"
import MobEvent from "../event/mobEvent"
import MobCreated from "./mobCreated"

describe("mob created event consumer", () => {
  it("adds a created mob to the mob service", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const service = await testBuilder.getService()

    // given
    const mobCreated = new MobCreated(service.mobService, testBuilder.withRoom().room)

    // when
    await mobCreated.consume(new MobEvent(EventType.MobCreated, getTestMob()))

    // then
    expect(service.mobService.mobTable.getMobs()).toHaveLength(1)
  })
})

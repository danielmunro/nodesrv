import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/eventType"
import TestBuilder from "../../support/test/testBuilder"
import ClientDisconnected from "./clientDisconnected"

describe("client disconnected event consumer", () => {
  it("removes a client's session mob from the mob service upon disconnect", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobService = await testBuilder.getMobService()
    const client = await testBuilder.withClient()
    const clientDisconnected = new ClientDisconnected(await testBuilder.getLocationService())

    // when
    await clientDisconnected.consume(new ClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(() => mobService.getLocationForMob(client.getSessionMob())).toThrowError()
  })
})

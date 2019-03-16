import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/eventType"
import TestBuilder from "../../test/testBuilder"
import ClientDisconnected from "./clientDisconnected"

describe("client disconnected event consumer", () => {
  it("removes a client's session mob from the mob service upon disconnect", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const service = await testBuilder.getService()
    const client = await testBuilder.withClient()
    const clientDisconnected = new ClientDisconnected(service.mobService.locationService)

    // when
    await clientDisconnected.consume(new ClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(() => service.mobService.locationService.getLocationForMob(client.getSessionMob())).toThrowError()
  })
})

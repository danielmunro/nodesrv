import {createTestAppContainer} from "../../app/testFactory"
import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/eventType"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import LocationService from "../service/locationService"
import ClientDisconnected from "./clientDisconnected"

describe("client disconnected event consumer", () => {
  it("removes a client's session mob from the mob service upon disconnect", async () => {
    // setup
    const app = await createTestAppContainer()
    const locationService = app.get<LocationService>(Types.LocationService)
    const mob = getTestMob()
    const client = jest.fn(() => ({ getSessionMob: () => mob }))() as any

    // given
    const clientDisconnected = new ClientDisconnected(locationService)

    // when
    await clientDisconnected.consume(new ClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(() => locationService.getRoomForMob(client.getSessionMob())).toThrowError()
  })
})

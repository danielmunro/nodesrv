import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createClientEvent} from "../../event/factory/eventFactory"
import LocationService from "../../mob/service/locationService"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import ClientDisconnectedEventConsumer from "./clientDisconnectedEventConsumer"

describe("client disconnected event consumer", () => {
  it("removes a client's session mob from the mob service upon disconnect", async () => {
    // setup
    const app = await createTestAppContainer()
    const locationService = app.get<LocationService>(Types.LocationService)
    const mob = getTestMob()
    const client = jest.fn(() => ({ getSessionMob: () => mob }))() as any

    // given
    const clientDisconnected = new ClientDisconnectedEventConsumer(locationService)

    // when
    await clientDisconnected.consume(createClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(() => locationService.getRoomForMob(client.getSessionMob())).toThrowError()
  })
})

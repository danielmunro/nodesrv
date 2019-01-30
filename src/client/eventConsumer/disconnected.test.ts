import EventService from "../../event/eventService"
import {EventType} from "../../event/eventType"
import LocationService from "../../mob/locationService"
import ClientService from "../../server/clientService"
import AuthService from "../../session/auth/authService"
import {getConnection, initializeConnection} from "../../support/db/connection"
import {getTestClient} from "../../test/client"
import ClientEvent from "../event/clientEvent"
import Disconnected from "./disconnected"

const playerRepository = jest.fn()

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("disconnected client event consumer", () => {
  it("should remove a client who disconnects", async () => {
    // setup
    const eventService = new EventService()
    const clientService = new ClientService(
      eventService,
      new AuthService(playerRepository(), null),
      new LocationService(null, null, eventService),
      [])
    const disconnected = new Disconnected(clientService)
    const client = await getTestClient()

    // given
    clientService.add(client)

    // when
    await disconnected.consume(new ClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

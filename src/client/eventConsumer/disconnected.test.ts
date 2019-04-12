import {EventType} from "../../event/eventType"
import ClientService from "../../server/clientService"
import AuthService from "../../session/auth/authService"
import {getConnection, initializeConnection} from "../../support/db/connection"
import TestBuilder from "../../support/test/testBuilder"
import ClientEvent from "../event/clientEvent"
import Disconnected from "./disconnected"

const playerRepository = jest.fn()

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("disconnected client event consumer", () => {
  it("should remove a client who disconnects", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const service = await testBuilder.getService()
    const clientService = new ClientService(
      testBuilder.eventService,
      new AuthService(playerRepository(), service.mobService),
      service.mobService.locationService,
      service.getActions())
    const disconnected = new Disconnected(clientService)
    const client = await testBuilder.withClient()

    // given
    clientService.add(client)

    // when
    await disconnected.consume(new ClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

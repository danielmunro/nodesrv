import {createTestAppContainer} from "../../app/testFactory"
import {EventType} from "../../event/enum/eventType"
import ClientService from "../../server/clientService"
import {Types} from "../../support/types"
import ClientEvent from "../event/clientEvent"
import Disconnected from "./disconnected"

const mockClient = jest.fn(() => ({ip: 123}))

describe("disconnected client event consumer", () => {
  it("should remove a client who disconnects", async () => {
    // setup
    const app = await createTestAppContainer()
    const clientService = app.get<ClientService>(Types.ClientService)
    const disconnected = new Disconnected(clientService)
    const client = mockClient() as any

    // given
    clientService.add(client)

    // when
    await disconnected.consume(new ClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

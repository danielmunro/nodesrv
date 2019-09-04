import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createClientEvent} from "../../event/factory/eventFactory"
import {Types} from "../../support/types"
import ClientService from "../service/clientService"
import DisconnectedEventConsumer from "./disconnectedEventConsumer"

const mockClient = jest.fn(() => ({ip: 123}))

describe("disconnected client event consumer", () => {
  it("should remove a client who disconnects", async () => {
    // setup
    const app = await createTestAppContainer()
    const clientService = app.get<ClientService>(Types.ClientService)
    const disconnected = new DisconnectedEventConsumer(clientService)
    const client = mockClient() as any

    // given
    clientService.add(client)

    // when
    await disconnected.consume(createClientEvent(EventType.ClientDisconnected, client))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

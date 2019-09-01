import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createMobEvent} from "../../event/factory/eventFactory"
import ClientService from "../../server/service/clientService"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import QuitEventConsumer from "./quitEventConsumer"

describe("quit client event consumer", () => {
  it("should remove clients from the clientService that have disconnected", async () => {
    // setup
    const app = await createTestAppContainer()
    const clientService = app.get<ClientService>(Types.ClientService)
    const quit = new QuitEventConsumer(clientService, jest.fn()())
    const mob = getTestMob()
    const mockClient = jest.fn(() => ({
      getSessionMob: () => mob,
      sendMessage: jest.fn(),
      ws: jest.fn(() => ({close: jest.fn()}))(),
    }))
    const client = mockClient() as any
    clientService.add(client)

    // when
    await quit.consume(createMobEvent(EventType.ClientDisconnected, client.getSessionMob()))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

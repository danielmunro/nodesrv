import {createTestAppContainer} from "../../app/testFactory"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import ClientService from "../../server/clientService"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import Quit from "./quit"

describe("quit client event consumer", () => {
  it("should remove clients from the clientService that have disconnected", async () => {
    // setup
    const app = await createTestAppContainer()
    const clientService = app.get<ClientService>(Types.ClientService)
    const quit = new Quit(clientService)
    const mob = getTestMob()
    const mockClient = jest.fn(() => ({
      getSessionMob: () => mob,
      sendMessage: jest.fn(),
      ws: jest.fn(() => ({close: jest.fn()}))(),
    }))
    const client = mockClient() as any
    clientService.add(client)

    // when
    await quit.consume(new MobEvent(EventType.ClientDisconnected, client.getSessionMob()))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

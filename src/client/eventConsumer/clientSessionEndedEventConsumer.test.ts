import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createMobEvent} from "../../event/factory/eventFactory"
import MobService from "../../mob/service/mobService"
import ClientService from "../../server/service/clientService"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import ClientSessionEndedEventConsumer from "./clientSessionEndedEventConsumer"

describe("client session ended event consumer", () => {
  it("should remove clients from the clientService that have disconnected", async () => {
    // setup
    const app = await createTestAppContainer()
    const clientService = app.get<ClientService>(Types.ClientService)
    const eventConsumer = new ClientSessionEndedEventConsumer(clientService, app.get<MobService>(Types.MobService))
    const mob = getTestMob()
    const mockClient = jest.fn(() => ({
      getSessionMob: () => mob,
      sendMessage: jest.fn(),
      ws: jest.fn(() => ({close: jest.fn()}))(),
    }))
    const client = mockClient() as any
    clientService.add(client)

    // when
    await eventConsumer.consume(createMobEvent(EventType.ClientDisconnected, client.getSessionMob()))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

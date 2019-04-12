import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import ClientService from "../../server/clientService"
import AuthService from "../../session/auth/authService"
import TestBuilder from "../../support/test/testBuilder"
import Quit from "./quit"

describe("quit client event consumer", () => {
  it("should remove clients from the clientService that have disconnected", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const service = await testBuilder.getService()
    const clientService = new ClientService(
      testBuilder.eventService,
      new AuthService(jest.fn()(), service.mobService),
      service.mobService.locationService,
      service.getActions())
    const quit = new Quit(clientService)
    const client = await testBuilder.withClient()
    clientService.add(client)

    // when
    await quit.consume(new MobEvent(EventType.ClientDisconnected, client.getSessionMob()))

    // then
    expect(clientService.getClientCount()).toBe(0)
  })
})

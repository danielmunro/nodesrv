import ResponseMessage from "../../request/responseMessage"
import ClientService from "../../server/clientService"
import TestBuilder from "../../test/testBuilder"
import RoomMessageEvent from "../event/roomMessageEvent"
import RoomMessageEventConsumer from "./roomMessageEventConsumer"

describe("room message event consumer", () => {
  it("notifies clients in the same room", async () => {
    // setup -- rooms & clients
    const testBuilder = new TestBuilder()
    const room1 = testBuilder.withRoom()
    const client1 = await testBuilder.withClient()
    const room2 = testBuilder.withRoom()
    testBuilder.useRoom(room2.room)
    const client2 = await testBuilder.withClient()

    // setup -- client service
    const service = await testBuilder.getService()
    const clientService = new ClientService(
      service.eventService,
      jest.fn()(),
      service.mobService.locationService,
      [],
      [client1, client2])

    // setup -- event consumer
    const roomMessageEventConsumer = new RoomMessageEventConsumer(
      clientService,
      service.mobService.locationService)

    // when
    await roomMessageEventConsumer.consume(
      new RoomMessageEvent(room1.room, new ResponseMessage(client1.getSessionMob(),  "")))

    // then
    expect(client1.ws.send.mock.calls).toHaveLength(1)
    expect(client2.ws.send.mock.calls).toHaveLength(0)
  })
})
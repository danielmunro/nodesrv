import {createTestAppContainer} from "../../app/factory/testFactory"
import EventConsumer from "../../event/eventConsumer"
import {createRoomMessageEvent} from "../../event/factory"
import LocationService from "../../mob/service/locationService"
import ResponseMessage from "../../request/responseMessage"
import ClientService from "../../server/clientService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import RoomMessageEventConsumer from "./roomMessageEventConsumer"

const mockSocket = jest.fn(() => ({
  onMessage: jest.fn(),
  send: jest.fn(),
}))
const mockRequest = jest.fn()

describe("room message event consumer", () => {
  it("notifies clients in the same room", async () => {
    // setup -- rooms & players
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const room1 = testRunner.getStartRoom()
    const room2 = testRunner.createRoom()
    const player1 = testRunner.createPlayer()
    const player2 = testRunner.createPlayer()
    const locationService = app.get<LocationService>(Types.LocationService)
    await locationService.updateMobLocation(player2.getMob(), room2.get())

    // setup -- log in clients
    const clientService = app.get<ClientService>(Types.ClientService)
    const client1 = clientService.createNewClient(mockSocket() as any, mockRequest())
    await client1.session.login(client1, player1.player)
    const client2 = clientService.createNewClient(mockSocket() as any, mockRequest())
    await client2.session.login(client2, player2.player)

    // setup -- event consumer instance
    const roomMessageEventConsumer = app.get<EventConsumer[]>(Types.EventConsumerTable).find(eventConsumer =>
      eventConsumer instanceof RoomMessageEventConsumer) as RoomMessageEventConsumer

    // when
    await roomMessageEventConsumer.consume(
      createRoomMessageEvent(room1.room, new ResponseMessage(player1.getMob(),  "")))

    // then
    expect(client1.ws.send.mock.calls).toHaveLength(1)
    expect(client2.ws.send.mock.calls).toHaveLength(0)
  })
})

import {createTestAppContainer} from "../../app/factory/testFactory"
import ClientService from "../../client/service/clientService"
import Socket from "../../client/socket"
import mockIncomingRequest from "../../client/test/mockIncomingRequest"
import mockWebSocket from "../../client/test/mockWebSocket"
import {createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import ResponseMessage from "../../messageExchange/responseMessage"
import LocationService from "../../mob/service/locationService"
import withValue from "../../support/functional/withValue"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import RoomMessageEventConsumer from "./roomMessageEventConsumer"

jest.mock("../../client/socket")

describe("room message event consumer", () => {
  it("notifies clients in the same room", async () => {
    // setup -- rooms & players
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const room1 = testRunner.getStartRoom()
    const room2 = testRunner.createRoom()
    const player1 = await testRunner.createPlayer()
    const player2 = await testRunner.createPlayer()
    const locationService = app.get<LocationService>(Types.LocationService)
    await locationService.updateMobLocation(player2.getMob(), room2.get())

    // setup -- log in clients
    const clientService = app.get<ClientService>(Types.ClientService)
    const client1 = clientService.createNewClient(new Socket(mockWebSocket()), mockIncomingRequest())
    await client1.session.login(client1, player1.player)
    const client2 = clientService.createNewClient(new Socket(mockWebSocket()), mockIncomingRequest())
    await client2.session.login(client2, player2.player)

    // setup -- event consumer instance
    await withValue(
      app.getAll<EventConsumer>(Types.EventConsumerTable).find(eventConsumer =>
      eventConsumer instanceof RoomMessageEventConsumer),
      consumer =>
        consumer.consume(createRoomMessageEvent(
          room1.room,
          new ResponseMessage(player1.getMob(),  ""))))

    // then
    // @ts-ignore
    expect(client1.socket.send.mock.calls).toHaveLength(1)
    // @ts-ignore
    expect(client2.socket.send.mock.calls).toHaveLength(0)
  })
})

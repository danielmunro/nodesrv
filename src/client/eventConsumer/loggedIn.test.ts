import EventConsumer from "../../event/eventConsumer"
import {EventType} from "../../event/eventType"
import StateService from "../../gameService/stateService"
import {createTestAppContainer} from "../../inversify.config"
import {Room} from "../../room/model/room"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import ClientEvent from "../event/clientEvent"
import LoggedIn from "./loggedIn"

describe("logged in client event consumer", () => {
  it("invokes 'look' action on login", async () => {
    // setup
    const mob = getTestMob()
    const mockClient = jest.fn(() => ({
      getSessionMob: () => mob,
      sendMessage: jest.fn(),
    }))
    const app = await createTestAppContainer()
    app.get<StateService>(Types.StateService).setTime(12)
    const room = app.get<Room>(Types.StartRoom)
    const client = mockClient() as any

    // given
    const loggedIn = app.get<EventConsumer[]>(Types.EventConsumerTable)
      .find(eventConsumer =>
        eventConsumer instanceof LoggedIn) as EventConsumer

    // when
    const eventResponse = await loggedIn.consume(new ClientEvent(EventType.ClientLogin, client))

    // then
    expect(eventResponse.context.getMessageToRequestCreator()).toBe(room.toString())
  })
})

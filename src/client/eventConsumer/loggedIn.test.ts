import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import {createClientEvent} from "../../event/factory/eventFactory"
import StateService from "../../gameService/stateService"
import {Room} from "../../room/model/room"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
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
    const eventResponse = await loggedIn.consume(createClientEvent(EventType.ClientLogin, client))

    // then
    expect(eventResponse.context.getMessageToRequestCreator()).toBe(room.toString())
  })
})

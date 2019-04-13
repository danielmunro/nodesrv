import {EventType} from "../../event/eventType"
import {RequestType} from "../../request/requestType"
import {getConnection, initializeConnection} from "../../support/db/connection"
import TestBuilder from "../../support/test/testBuilder"
import ClientEvent from "../event/clientEvent"
import LoggedIn from "./loggedIn"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("logged in client event consumer", () => {
  it("should invoke 'look' action on login", async () => {
    const testBuilder = new TestBuilder()
    const lookAction = await testBuilder.getAction(RequestType.Look)
    const roomBuilder = testBuilder.withRoom()
    const loggedIn = new LoggedIn(
      await testBuilder.getLocationService(), roomBuilder.room, lookAction)
    const client = await testBuilder.withClient()

    const eventResponse = await loggedIn.consume(new ClientEvent(EventType.ClientLogin, client))

    expect(eventResponse.context.getMessageToRequestCreator()).toBe(roomBuilder.room.toString())
  })
})

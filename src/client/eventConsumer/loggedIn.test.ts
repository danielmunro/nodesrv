import {EventType} from "../../event/eventType"
import {RequestType} from "../../request/requestType"
import {getConnection, initializeConnection} from "../../support/db/connection"
import {getTestRoom} from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import ClientEvent from "../event/clientEvent"
import LoggedIn from "./loggedIn"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("logged in client event consumer", () => {
  it("should invoke 'look' action on login", async () => {
    const testBuilder = new TestBuilder()
    const lookAction = await testBuilder.getAction(RequestType.Look)
    const loggedIn = new LoggedIn(getTestRoom(), lookAction)
    const client = await testBuilder.withClient()

    const eventResponse = await loggedIn.consume(new ClientEvent(EventType.ClientLogin, client))

    expect(eventResponse.context.message.getMessageToRequestCreator()).toBe(
`(undefined) a test room

description of a test room

Exits []`)
  })
})

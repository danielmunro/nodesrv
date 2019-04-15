import InputContext from "../../request/context/inputContext"
import Request from "../../request/request"
import { RequestType } from "../../request/requestType"
import {getConnection, initializeConnection} from "../../support/db/connection"
import { getTestRoom } from "../../support/test/room"
import TestBuilder from "../../support/test/testBuilder"
import { HandleClientRequests } from "./handleClientRequests"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("handleClientRequests", () => {
  it("should be able to handle requests on clients", async () => {
    const testBuilder = new TestBuilder()
    const client = await testBuilder.withClient()
    client.addRequest(new Request(client.player.sessionMob, getTestRoom(), new InputContext(RequestType.Any)))

    expect(client.hasRequests()).toBe(true)
    await new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(false)
  })

  it("should not notify a client if the client has a delay", async () => {
    const testBuilder = new TestBuilder()
    const client = await testBuilder.withClient()
    client.addRequest(new Request(client.player.sessionMob, getTestRoom(), new InputContext(RequestType.Any)))
    client.player.delay += 1

    expect(client.hasRequests()).toBe(true)
    await new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(true)
  })
})

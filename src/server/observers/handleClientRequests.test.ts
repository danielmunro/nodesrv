import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestClient } from "../../test/client"
import { HandleClientRequests } from "./handleClientRequests"

describe("handleClientRequests", () => {
  it("should be able to handle requests on clients", async () => {
    const client = await getTestClient()
    client.addRequest(new Request(client.player.sessionMob, new InputContext(RequestType.Any)))

    expect(client.hasRequests()).toBe(true)
    new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(false)
  })

  it("should not notify a client if the client has a delay", async () => {
    const client = await getTestClient()
    client.addRequest(new Request(client.player.sessionMob, new InputContext(RequestType.Any)))
    client.player.delay += 1

    expect(client.hasRequests()).toBe(true)
    new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(true)
  })
})

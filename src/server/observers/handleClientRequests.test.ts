import { RequestType } from "../../request/requestType"
import { Request } from "../../request/request"
import { getTestClient } from "../../test/client"
import { HandleClientRequests } from "./handleClientRequests"

describe("handleClientRequests", () => {
  it("should be able to handle requests on clients", () => {
    const client = getTestClient()
    client.addRequest(new Request(client.player, RequestType.Any))

    expect(client.hasRequests()).toBe(true)
    new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(false)
  })

  it("should not notify a client if the client has a delay", () => {
    const client = getTestClient()
    client.addRequest(new Request(client.player, RequestType.Any))
    client.player.delay += 1

    expect(client.hasRequests()).toBe(true)
    new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(true)
  })
})

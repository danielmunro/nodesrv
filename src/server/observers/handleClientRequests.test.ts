import { RequestType } from "../../handler/constants"
import { getTestClient } from "../../test/client"
import { Request } from "../request/request"
import { HandleClientRequests } from "./handleClientRequests"

describe("handleClientRequests", () => {
  it("should be able to handle requests on clients", () => {
    const client = getTestClient()
    client.addRequest(new Request(client.getPlayer(), RequestType.Any))

    expect(client.hasRequests()).toBe(true)
    new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(false)
  })

  it("should not notify a client if the client has a delay", () => {
    const client = getTestClient()
    client.addRequest(new Request(client.getPlayer(), RequestType.Any))
    client.getPlayer().delay += 1

    expect(client.hasRequests()).toBe(true)
    new HandleClientRequests().notify([client])
    expect(client.hasRequests()).toBe(true)
  })
})

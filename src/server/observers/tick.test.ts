import { getTestClient } from "../../test/client"
import { Tick } from "./tick"

describe("ticks", () => {
  it("should call tick on all clients", () => {
    const tick = new Tick()
    const clients = [
      getTestClient(),
      getTestClient(),
      getTestClient(),
      getTestClient(),
      getTestClient(),
    ]
    tick.notify(clients)
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })
})

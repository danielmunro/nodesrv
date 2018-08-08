import { getTestClient } from "../../test/client"
import { Tick } from "./tick"

describe("ticks", () => {
  it("should call tick on all clients", async () => {
    const tick = new Tick()
    const clients = [
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
    ]
    tick.notify(clients)
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })
})

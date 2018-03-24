import { Client } from "../../client/client"
import { Tick } from "./tick"

jest.mock("../../client/client")

describe("ticks", () => {
  it("should call tick on all clients", () => {
    const tick = new Tick()
    const clients = [
      new Client(),
      new Client(),
      new Client(),
      new Client(),
      new Client(),
    ]
    tick.notify(clients)
    expect.assertions(clients.length)
    clients.forEach((client) => expect(client.tick.mock.calls.length).toBe(1))
  })
})

import {getConnection, initializeConnection} from "../../support/db/connection"
import { getTestClient } from "../../test/client"
import { DecrementPlayerDelay } from "./decrementPlayerDelay"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("decrement player delay", () => {
  it("should decrement delay for players if needed", async () => {
    // setup
    const clients = [
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
    ]
    const p1 = clients[0].player
    const p2 = clients[1].player
    const p3 = clients[2].player
    p1.delay = 2
    p2.delay = 0
    p3.delay = 1
    const decrementPlayerDelay = new DecrementPlayerDelay()

    // WHEN
    decrementPlayerDelay.notify(clients)

    // THEN
    expect(p1.delay).toBe(1)
    expect(p2.delay).toBe(0)
    expect(p3.delay).toBe(0)
  })
})

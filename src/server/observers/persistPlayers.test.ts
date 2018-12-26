import { getPlayerRepository } from "../../player/repository/player"
import {getConnection, initializeConnection} from "../../support/db/connection"
import { getTestClient } from "../../test/client"
import { PersistPlayers } from "./persistPlayers"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("persistPlayers", () => {
  it("should save any player models passed in", () => {
    expect.assertions(6)
    return getPlayerRepository()
      .then(async () => {
        const persistPlayers = new PersistPlayers()
        const clients = [
          await getTestClient(),
          await getTestClient(),
          await getTestClient(),
        ]
        clients.forEach((client) => expect(client.player.id).toBeUndefined())
        return persistPlayers.notify(clients).then(() =>
          clients.forEach((client) => expect(client.player.id).toBeGreaterThan(0)))
      })
  })
})

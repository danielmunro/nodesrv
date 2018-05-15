import { Client } from "../../client/client"
import { getPlayerRepository } from "../../player/repository/player"
import { getTestClient } from "../../test/client"
import { getTestPlayer } from "../../test/player"
import { PersistPlayers } from "./persistPlayers"

describe("persistPlayers", () => {
  it("should save any player models passed in", () => {
    expect.assertions(6)
    return getPlayerRepository()
      .then((playerRepository) => {
        const persistPlayers = new PersistPlayers()
        const clients = [
          getTestClient(),
          getTestClient(),
          getTestClient(),
        ]
        clients.forEach((client) => expect(client.player.id).toBeUndefined())
        return persistPlayers.notify(clients).then(() =>
          clients.forEach((client) => expect(client.player.id).toBeGreaterThan(0)))
      })
  })
})

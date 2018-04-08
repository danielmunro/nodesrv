import { Client } from "../../client/client"
import { getPlayerRepository } from "../../player/repository/player"
import { getTestPlayer } from "../../test/player"
import { PersistPlayers } from "./persistPlayers"

jest.mock("../../client/client")

function getMockClient(): Client {
  const client = new Client()
  client.player = getTestPlayer()

  return client
}

describe("persistPlayers", () => {
  it("should save any player models passed in", () => {
    expect.assertions(6)
    return getPlayerRepository()
      .then((playerRepository) => {
        const persistPlayers = new PersistPlayers()
        const clients = [
          getMockClient(),
          getMockClient(),
          getMockClient(),
        ]
        clients.forEach((client) => expect(client.player.id).toBeUndefined())
        return persistPlayers.notify(clients).then(() =>
          clients.forEach((client) => expect(client.player.id).toBeGreaterThan(0)))
      })
  })
})

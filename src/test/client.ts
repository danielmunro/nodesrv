import { Client } from "../client/client"
import { actions } from "../handler/actions"
import { getTestPlayer } from "./player"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

export function getTestClient(player = getTestPlayer()): Client {
  const client = new Client(ws(), actions)
  client.player = player

  return client
}

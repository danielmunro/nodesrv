import { Client } from "../client/client"
import { actions } from "../handler/actions"
import { getTestMob } from "./mob"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

export function getTestClient(player = getTestPlayer()): Client {
  const client = new Client(ws(), actions, getTestRoom())
  client.player = player
  client.session.loginWithMob(getTestMob())

  return client
}

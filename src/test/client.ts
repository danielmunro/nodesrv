import { Client } from "../client/client"
import { actions } from "../action/actionCollection"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

function createClient(player): Client {
  const client = new Client(ws(), "127.0.0.1", actions, getTestRoom())
  client.player = player

  return client
}

export function getTestClient(player = getTestPlayer()): Client {
  const client = createClient(player)
  client.session.login(player)

  return client
}

export function getTestClientLoggedOut(player = getTestPlayer()): Client {
  return createClient(player)
}

import getActionCollection from "../action/actionCollection"
import { Client } from "../client/client"
import Service from "../room/service"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

function createClient(player, actions, service, startRoom): Client {
  const client = new Client(ws(), "127.0.0.1", actions, service, startRoom)
  client.player = player

  return client
}

export async function getTestClient(player = getTestPlayer()): Promise<Client> {
  const service = await Service.new()
  const actions = await getActionCollection(service)
  const client = createClient(player, actions, service, player.sessionMob.room)
  await client.session.login(player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer()): Promise<Client> {
  const service = await Service.new()
  const actions = await getActionCollection(service)
  return createClient(player, actions, service, player.sessionMob.room)
}

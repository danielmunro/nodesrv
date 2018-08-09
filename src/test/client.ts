import getActionCollection from "../action/actionCollection"
import { Client } from "../client/client"
import Service from "../room/service"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

function createClient(player, actions, service): Client {
  const client = new Client(ws(), "127.0.0.1", actions, service)
  client.player = player

  return client
}

export async function getTestClient(player = getTestPlayer()): Promise<Client> {
  const service = await Service.new(getTestRoom())
  const actions = await getActionCollection(service)
  const client = createClient(player, actions, service)
  await client.session.login(player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer()): Promise<Client> {
  const actions = await getActionCollection(await Service.new(getTestRoom()))
  return createClient(player, actions)
}

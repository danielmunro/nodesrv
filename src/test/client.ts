import getActionCollection from "../action/actionCollection"
import { Client } from "../client/client"
import { getPlayerRepository } from "../player/repository/player"
import Service from "../room/service"
import { default as AuthService } from "../session/auth/service"
import { getTestPlayer } from "./player"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

async function createClient(player, actions, service, startRoom): Promise<Client> {
  const client = new Client(ws(), "127.0.0.1", actions, service, startRoom, new AuthService(await getPlayerRepository()))
  client.player = player

  return client
}

export async function getTestClient(player = getTestPlayer()): Promise<Client> {
  const service = await Service.new()
  const actions = await getActionCollection(service)
  const client = await createClient(player, actions, service, player.sessionMob.room)
  await client.session.login(player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer()): Promise<Client> {
  const service = await Service.new()
  const actions = await getActionCollection(service)
  return createClient(player, actions, service, player.sessionMob.room)
}

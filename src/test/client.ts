import getActionCollection from "../action/actionCollection"
import { Client } from "../client/client"
import { getPlayerRepository } from "../player/repository/player"
import Service from "../service/service"
import { default as AuthService } from "../session/auth/service"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"
import LocationService from "../mob/locationService"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

async function createClient(player, actions, service, startRoom, locationService): Promise<Client> {
  const client = new Client(
    ws(), "127.0.0.1", actions, service, startRoom,
    new AuthService(await getPlayerRepository()), locationService)
  client.player = player

  return client
}

export async function getTestClient(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const locationService = new LocationService([])
  const service = await Service.new(locationService)
  const actions = await getActionCollection(service)
  const client = await createClient(player, actions, service, room, locationService)
  await client.session.login(player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const service = await Service.newWithArray([room])
  const actions = await getActionCollection(service)
  return createClient(player, actions, service, room, service.locationService)
}

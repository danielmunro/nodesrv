import getActionCollection from "../action/actionCollection"
import { Client } from "../client/client"
import GameService from "../gameService/gameService"
import MobService from "../mob/mobService"
import MobTable from "../mob/mobTable"
import { getMobRepository } from "../mob/repository/mob"
import { getPlayerRepository } from "../player/repository/player"
import RoomTable from "../room/roomTable"
import { default as AuthService } from "../session/auth/service"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

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
  const service = await GameService.new(
    new MobService(), null)
  const actions = await getActionCollection(service)
  const client = await createClient(player, actions, service, room, service.mobService.locationService)
  await client.session.login(player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const service = await GameService.new(
    new MobService(), null, RoomTable.new([room]))
  const actions = await getActionCollection(service)
  return createClient(player, actions, service, room, service.mobService.mobTable)
}

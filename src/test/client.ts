import { Client } from "../client/client"
import GameService from "../gameService/gameService"
import MobService from "../mob/mobService"
import { getPlayerRepository } from "../player/repository/player"
import RoomTable from "../room/roomTable"
import Email from "../session/auth/login/email"
import { default as AuthService } from "../session/auth/service"
import Session from "../session/session"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

async function createClient(
  player, actions, service: GameService, startRoom, locationService, authService: AuthService): Promise<Client> {
  const client = new Client(
    new Session(new Email(authService), locationService),
    ws(),
    "127.0.0.1",
    actions,
    service,
    startRoom,
    locationService)
  client.player = player

  return client
}

export async function getTestClient(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const service = new GameService(new MobService(), null, null, null)
  const actions = service.getActionCollection()
  const authService = new AuthService(await getPlayerRepository())
  const client = await createClient(player, actions, service, room, service.mobService.locationService, authService)
  await client.session.login(client, player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const service = new GameService(new MobService(), RoomTable.new([room]), null, null)
  const authService = new AuthService(await getPlayerRepository())
  return createClient(player, service.getActionCollection(), service, room, service.mobService.mobTable, authService)
}

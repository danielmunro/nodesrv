import { Client } from "../client/client"
import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import MobService from "../mob/mobService"
import { getPlayerRepository } from "../player/repository/player"
import RoomTable from "../room/roomTable"
import { default as AuthService } from "../session/auth/authService"
import Email from "../session/auth/login/email"
import Session from "../session/session"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

async function createClient(
  player, actions, service: GameService, startRoom, locationService, authService: AuthService): Promise<Client> {
  const client = new Client(
    new Session(new Email(authService)),
    ws(),
    "127.0.0.1",
    actions,
    locationService,
    new EventService())
  client.player = player

  return client
}

export async function getTestClient(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const mobService = new MobService()
  const service = new GameService(mobService, null, null, null, null)
  const actions = service.getActions()
  const authService = new AuthService(await getPlayerRepository(), mobService)
  const client = await createClient(player, actions, service, room, service.mobService.locationService, authService)
  await client.session.login(client, player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const mobService = new MobService()
  const service = new GameService(new MobService(), RoomTable.new([room]), null, null, null)
  const authService = new AuthService(await getPlayerRepository(), mobService)
  return createClient(player, service.getActions(), service, room, service.mobService.mobTable, authService)
}

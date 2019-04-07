import Action from "../../action/action"
import { Client } from "../../client/client"
import EventService from "../../event/eventService"
import ActionService from "../../gameService/actionService"
import GameService from "../../gameService/gameService"
import ItemService from "../../item/itemService"
import LocationService from "../../mob/locationService"
import MobService from "../../mob/mobService"
import {Player} from "../../player/model/player"
import { getPlayerRepository } from "../../player/repository/player"
import RoomTable from "../../room/roomTable"
import { default as AuthService } from "../../session/auth/authService"
import Email from "../../session/auth/login/email"
import Session from "../../session/session"
import { getTestPlayer } from "./player"
import { getTestRoom } from "./room"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

const mock = jest.fn()

async function createClient(
  player: Player, actions: Action[], locationService: LocationService, authService: AuthService): Promise<Client> {
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

export async function getTestClient(player = getTestPlayer()): Promise<Client> {
  const mobService = new MobService(mock(), mock(), mock(), mock())
  const service = new GameService(mobService, mock(), mock(), mock(), new ActionService([], [], []), mock())
  const actions = service.getActions()
  const authService = new AuthService(await getPlayerRepository(), mobService)
  const client = await createClient(player, actions, service.mobService.locationService, authService)
  await client.session.login(client, player)

  return Promise.resolve(client)
}

export async function getTestClientLoggedOut(player = getTestPlayer(), room = getTestRoom()): Promise<Client> {
  const mobService = new MobService(mock(), mock(), mock(), mock())
  const service = new GameService(
    mobService,
    RoomTable.new([room]),
    new ItemService(),
    new EventService(),
    new ActionService([], [], []), mock())
  const authService = new AuthService(await getPlayerRepository(), mobService)
  return createClient(player, service.getActions(), service.mobService.locationService, authService)
}

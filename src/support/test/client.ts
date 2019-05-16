import Action from "../../action/action"
import { Client } from "../../client/client"
import EventService from "../../event/eventService"
import ActionService from "../../gameService/actionService"
import GameService from "../../gameService/gameService"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {Player} from "../../player/model/player"
import { default as AuthService } from "../../session/auth/creationService"
import Email from "../../session/auth/login/email"
import Session from "../../session/session"
import { getTestPlayer } from "./player"

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
  const service = new GameService(mobService, new ActionService([], [], []))
  const actions = service.getActions()
  const authService = new AuthService(mock(), mobService)
  const client = await createClient(player, actions, mock(), authService)
  await client.session.login(client, player)

  return Promise.resolve(client)
}

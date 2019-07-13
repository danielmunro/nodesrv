import Action from "../../action/impl/action"
import ActionService from "../../action/service/actionService"
import { Client } from "../../client/client"
import EventService from "../../event/service/eventService"
import GameService from "../../gameService/gameService"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {PlayerEntity} from "../../player/entity/playerEntity"
import Email from "../../session/auth/authStep/login/email"
import { default as AuthService } from "../../session/auth/service/creationService"
import SessionService from "../../session/service/sessionService"
import { getTestPlayer } from "./player"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

const mock = jest.fn()

async function createClient(
  player: PlayerEntity,
  actions: Action[],
  locationService: LocationService,
  authService: AuthService): Promise<Client> {
  const client = new Client(
    new SessionService(new Email(authService)),
    ws() as any,
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
  const client = await createClient(player, actions, mock(), mock())
  await client.session.login(client, player)

  return Promise.resolve(client)
}

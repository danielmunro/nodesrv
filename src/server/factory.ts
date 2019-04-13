import * as assert from "assert"
import { Server as WebSocketServer } from "ws"
import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import ResetService from "../gameService/resetService"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import { Room } from "../room/model/room"
import ClientService from "./clientService"
import addObservers from "./observerDecorator"
import { GameServer } from "./server"

const PORT_MIN = 1080
const PORT_MAX = 65535

/* tslint:disable */
export default async function newServer(
  service: GameService,
  port: number,
  startRoom: Room,
  resetService: ResetService,
  mobService: MobService,
  eventService: EventService,
  clientService: ClientService,
  locationService: LocationService): Promise<GameServer> {
  assert.ok(port > PORT_MIN && port < PORT_MAX, `port must be between ${PORT_MIN} and ${PORT_MAX}`)
  return addObservers(
    service,
    new GameServer(
      new WebSocketServer({ port }),
      startRoom,
      clientService,
      eventService),
    resetService,
    eventService,
    mobService,
    locationService)
}

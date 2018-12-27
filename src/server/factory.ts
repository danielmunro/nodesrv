import * as assert from "assert"
import { Server as WebSocketServer } from "ws"
import GameService from "../gameService/gameService"
import ResetService from "../gameService/resetService"
import MobService from "../mob/mobService"
import { Room } from "../room/model/room"
import addObservers from "./observerDecorator"
import { GameServer } from "./server"

const PORT_MIN = 1080
const PORT_MAX = 65535

export default async function newServer(
  service: GameService,
  port: number,
  startRoom: Room,
  resetService: ResetService,
  mobService: MobService): Promise<GameServer> {
  assert.ok(port > PORT_MIN && port < PORT_MAX, `port must be between ${PORT_MIN} and ${PORT_MAX}`)
  return addObservers(
    new GameServer(new WebSocketServer({ port }), service, startRoom, mobService),
    resetService)
}

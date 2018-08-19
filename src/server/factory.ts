import * as assert from "assert"
import { Server as WebSocketServer } from "ws"
import Service from "../room/service"
import addObservers from "./observerDecorator"
import { GameServer } from "./server"
import { Room } from "../room/model/room"

const PORT_MIN = 1080
const PORT_MAX = 65535

export default function newServer(service: Service, port: number, startRoom: Room): GameServer {
  assert.ok(port > PORT_MIN && port < PORT_MAX, `port must be between ${PORT_MIN} and ${PORT_MAX}`)
  return addObservers(new GameServer(new WebSocketServer({ port }), service, startRoom))
}

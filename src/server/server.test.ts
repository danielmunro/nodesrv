import { Server, WebSocket } from "mock-socket"
import { GameServer } from "./server";
import { ImmediateTimer } from "./timer/immediate-timer"

let ws

function getGameServer(): GameServer {
  return new GameServer(ws)
}

function startGameServer(gs): void {
  gs.start(new ImmediateTimer())
}

beforeEach(() => {
  ws = new Server('ws://localhost:1234')
})

afterEach(() => {
  ws.stop()
})

describe("the server should", () => {
  test("start if initialized", () => {
    const server = getGameServer()
    expect(server.isInitialized()).toBe(true)
    startGameServer(server)
    expect(server.isStarted()).toBe(true)
  })
  
  test("not start again if already started", () => {
    const server = getGameServer()
    startGameServer(server)
    expect(() => startGameServer(server)).toThrowError()
    server.terminate()
    expect(() => startGameServer(server)).toThrowError()
    expect(server.isTerminated()).toBe(true)
  })
})

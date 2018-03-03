import { Server } from "mock-socket"
import { Player } from "./../player/player"
import { DontExecuteTestObserver } from "./../test/dontExecuteTestObserver"
import { ExpectTestObserver } from "./../test/expectTestObserver"
import { getTestPlayer } from "./../test/player"
import { GameServer } from "./server"
import { ImmediateTimer } from "./timer/immediateTimer"
import { ShortIntervalTimer } from "./timer/shortIntervalTimer"

let ws

function playerProvider(name: string): Player {
  return getTestPlayer()
}

function getGameServer(): GameServer {
  return new GameServer(ws, playerProvider)
}

function startGameServer(gs): void {
  gs.start(new ImmediateTimer())
}

beforeEach(() => {
  ws = new Server("ws://localhost:1234")
})

afterEach(() => {
  ws.stop()
})

describe("the server", () => {
  test("should start if initialized", () => {
    const server = getGameServer()
    expect(server.isInitialized()).toBe(true)
    startGameServer(server)
    expect(server.isStarted()).toBe(true)
  })

  test("should not start again if already started", () => {
    const server = getGameServer()
    startGameServer(server)
    expect(() => startGameServer(server)).toThrowError()
    server.terminate()
    expect(() => startGameServer(server)).toThrowError()
    expect(server.isTerminated()).toBe(true)
  })

  test("with new WS connections should add a client", () => {
    const server = getGameServer()
    startGameServer(server)
    server.addWS({})
    expect(server.getClientCount()).toBe(1)
  })

  test("should remove clients that have been closed", () => {
    const server = getGameServer()
    startGameServer(server)
    const client = {onclose: () => {}}
    server.addWS(client)
    client.onclose()
    expect(server.getClientCount()).toBe(0)
  })

  test("should notify an observer immediately if it is added with an immediate timer", () => {
    const server = getGameServer()
    startGameServer(server)
    server.addWS({})
    expect.assertions(1)
    server.addObserver(new ExpectTestObserver(), new ImmediateTimer())
  })

  test("should not notify an observer immediately if a timeout larger than 0 is specified", () => {
    const server = getGameServer()
    startGameServer(server)
    server.addWS({})
    const observer = new DontExecuteTestObserver()
    const spy = jest.spyOn(observer, "notify")
    const shortIntervalTimer = new ShortIntervalTimer()
    server.addObserver(observer, shortIntervalTimer)
    expect(spy).not.toBeCalled()
  })
})

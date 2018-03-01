import { Server, WebSocket } from "mock-socket"
import { Player } from "./../player/player"
import { Room } from "./../room/room"
import { readMessages } from "./../social/chat"
import { GameServer } from "./server"
import { ImmediateTimer } from "./timer/immediateTimer"
import { Observer } from "./observers/observer"
import { Client } from "../client/client"

let ws
const defaultRoom = new Room("uuid", "name", "test room", [])

function playerProvider(name: string): Player {
  return new Player("test player")
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
    class TestObserver implements Observer {
      public notify(clients: Client[]) {
        expect(clients.length).toBe(1)
      }
    }

    const server = getGameServer()
    startGameServer(server)
    server.addWS({})
    expect(server.addObserver(new TestObserver(), new ImmediateTimer()))
  })

  test("should remove clients that have been closed", () => {
    class TestObserver implements Observer {
      public notify(clients: Client[]) {
        expect(clients.length).toBe(0)
      }
    }
    
    const server = getGameServer()
    startGameServer(server)
    const client = {onclose: () => {}}
    server.addWS(client)
    client.onclose()
    expect(server.addObserver(new TestObserver(), new ImmediateTimer()))
  })
})

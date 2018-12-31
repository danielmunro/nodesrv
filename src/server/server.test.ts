import { Server } from "mock-socket"
import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import FightTable from "../mob/fight/fightTable"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import MobTable from "../mob/mobTable"
import {getConnection, initializeConnection} from "../support/db/connection"
import { DontExecuteTestObserver } from "../test/dontExecuteTestObserver"
import { ExpectTestObserver } from "../test/expectTestObserver"
import { getTestRoom } from "../test/room"
import { ImmediateTimer } from "../timer/immediateTimer"
import { ShortIntervalTimer } from "../timer/shortIntervalTimer"
import ClientService from "./clientService"
import { GameServer } from "./server"

let ws

async function getGameServer(): Promise<GameServer> {
  const locationService = new LocationService([])
  const mobService = new MobService(
    new MobTable(),
    new MobTable(),
    new FightTable(),
    locationService)
  const gameService = new GameService(mobService, null, null, null)
  return new GameServer(
    ws,
    gameService,
    getTestRoom(),
    mobService,
    new EventService(),
    new ClientService(mobService.locationService, gameService.getActionCollection()))
}

const mockWs = jest.fn(() => ({ send: jest.fn() }))
const mockRequest = jest.fn(() => ({connection: { remoteAddress: "123"}}))

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

beforeEach(() => {
  ws = new Server("ws://localhost:1234")
})

afterEach(() => {
  ws.stop()
})

describe("the server", () => {
  test("should start if initialized", async () => {
    const server = await getGameServer()
    expect(server.isInitialized()).toBe(true)
    await server.start()
    expect(server.isStarted()).toBe(true)
  })

  test("should not start again if already started", async () => {
    const server = await getGameServer()
    await server.start()
    expect(server.start()).rejects.toThrowError()
    server.terminate()
    expect(server.start()).rejects.toThrowError()
    expect(server.isTerminated()).toBe(true)
  })

  test("with new WS connections should add a client", async () => {
    const server = await getGameServer()
    await server.start()
    await server.addWS(mockWs(), mockRequest())
    expect(server.getClientCount()).toBe(1)
  })

  test("should remove clients that have been closed", async () => {
    const server = await getGameServer()
    await server.start()
    const client = mockWs()
    await server.addWS(client, mockRequest())
    client.onclose()
    expect(server.getClientCount()).toBe(0)
  })

  test("closing a client should remove it from the server's clients", async () => {
    const server = await getGameServer()
    await server.start()
    const wsClient = mockWs()
    await server.addWS(wsClient, mockRequest())
    expect(server.getClientCount()).toBe(1)
    wsClient.onclose()
    expect(server.getClientCount()).toBe(0)
  })

  test("should notify an observer immediately if it is added with an immediate timer", async () => {
    const server = await getGameServer()
    await server.start()
    await server.addWS(mockWs(), mockRequest())
    expect.assertions(1)
    server.addObserver(new ExpectTestObserver(), new ImmediateTimer())
  })

  test("should not notify an observer immediately if a timeout larger than 0 is specified", async () => {
    const server = await getGameServer()
    await server.start()
    await server.addWS(mockWs(), mockRequest())
    const observer = new DontExecuteTestObserver()
    const spy = jest.spyOn(observer, "notify")
    const shortIntervalTimer = new ShortIntervalTimer()
    server.addObserver(observer, shortIntervalTimer)
    expect(spy).not.toBeCalled()
  })
})

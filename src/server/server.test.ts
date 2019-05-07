import { Server } from "mock-socket"
import EventService from "../event/eventService"
import ActionService from "../gameService/actionService"
import GameService from "../gameService/gameService"
import FightTable from "../mob/fight/fightTable"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import MobTable from "../mob/mobTable"
import {getPlayerRepository} from "../player/repository/player"
import ExitTable from "../room/exitTable"
import RoomTable from "../room/roomTable"
import AuthService from "../session/auth/authService"
import {getConnection, initializeConnection} from "../support/db/connection"
import { DontExecuteTestObserver } from "../support/test/dontExecuteTestObserver"
import { ExpectTestObserver } from "../support/test/expectTestObserver"
import { getTestRoom } from "../support/test/room"
import { ImmediateTimer } from "../support/timer/immediateTimer"
import { ShortIntervalTimer } from "../support/timer/shortIntervalTimer"
import ClientService from "./clientService"
import { GameServer } from "./server"

let ws

async function getGameServer(): Promise<GameServer> {
  const eventService = new EventService()
  const room = getTestRoom()
  const locationService = new LocationService(RoomTable.new([room]), eventService, new ExitTable(), room)
  const mobService = new MobService(new MobTable(), locationService, new MobTable(), new FightTable())
  const gameService = new GameService(mobService, new ActionService([], [], []))
  return new GameServer(
    ws,
    room,
    new ClientService(
      eventService,
      new AuthService(await getPlayerRepository(), mobService),
      locationService,
      gameService.getActionService().actions,
    ),
    eventService)
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

  test("should notify an observer immediately if it has added with an immediate timer", async () => {
    const server = await getGameServer()
    await server.start()
    await server.addWS(mockWs(), mockRequest())
    expect.assertions(1)
    server.addObserver(new ExpectTestObserver(), new ImmediateTimer())
  })

  test("should not notify an observer immediately if a timeout larger than 0 has specified", async () => {
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

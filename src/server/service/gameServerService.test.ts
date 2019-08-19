// @ts-ignore
import { Server } from "mock-socket"
import {createTestAppContainer} from "../../app/factory/testFactory"
import EventService from "../../event/service/eventService"
import { DontExecuteTestObserver } from "../../support/test/dontExecuteTestObserver"
import { ExpectTestObserver } from "../../support/test/expectTestObserver"
import TestRunner from "../../support/test/testRunner"
import { ImmediateTimer } from "../../support/timer/immediateTimer"
import { ShortIntervalTimer } from "../../support/timer/shortIntervalTimer"
import {Types} from "../../support/types"
import ClientService from "./clientService"
import { GameServerService } from "./gameServerService"

let ws: any

async function getGameServer(): Promise<GameServerService> {
  const app = await createTestAppContainer()
  const eventService = app.get<EventService>(Types.EventService)
  const testRunner = app.get<TestRunner>(Types.TestRunner)
  const room = testRunner.getStartRoom().get()
  return new GameServerService(
    ws,
    room,
    app.get<ClientService>(Types.ClientService),
    eventService)
}

const mockWs = jest.fn(() => ({ send: jest.fn() }))
const mockRequest = jest.fn(() => ({connection: { remoteAddress: "123"}}))

beforeEach(() => {
  ws = new Server("ws://localhost:1234")
})

afterEach(() => {
  ws.stop()
})

describe("the server", () => {
  test("starts if initialized", async () => {
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
    await server.addWS(mockWs() as any, mockRequest() as any)
    expect(server.getClientCount()).toBe(1)
  })

  test("should notify an observer immediately if it has added with an immediate timer", async () => {
    const server = await getGameServer()
    await server.start()
    await server.addWS(mockWs() as any, mockRequest() as any)
    expect.assertions(1)
    server.addObserver(new ExpectTestObserver(), new ImmediateTimer())
  })

  test("should not notify an observer immediately if a timeout larger than 0 has specified", async () => {
    const server = await getGameServer()
    await server.start()
    await server.addWS(mockWs() as any, mockRequest() as any)
    const observer = new DontExecuteTestObserver()
    const spy = jest.spyOn(observer, "notify")
    const shortIntervalTimer = new ShortIntervalTimer()
    server.addObserver(observer, shortIntervalTimer)
    expect(spy).not.toBeCalled()
  })
})

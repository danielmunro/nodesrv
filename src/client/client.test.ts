import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import {Player} from "../player/model/player"
import InputContext from "../request/context/inputContext"
import {Request} from "../request/request"
import {RequestType} from "../request/requestType"
import {default as AuthRequest} from "../session/auth/request"
import Session from "../session/session"
import {SpellMessages} from "../spell/constants"
import {getConnection, initializeConnection} from "../support/db/connection"
import {getTestClientLoggedOut} from "../test/client"
import {getTestRoom} from "../test/room"
import TestBuilder from "../test/testBuilder"
import {Client} from "./client"
import {MESSAGE_NOT_UNDERSTOOD} from "./constants"

function getNewTestMessageEvent(message = "hello world") {
  return new MessageEvent("test", {data: "{\"request\": \"" + message + "\"}"})
}

let testBuilder: TestBuilder
let client: Client

beforeEach(async () => {
  testBuilder = new TestBuilder()
  client = await testBuilder.withClient()
})

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("client sanity checks", () => {
  it("has requests sanity createDefaultCheckFor", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.addRequest(new Request(client.getSessionMob(), getTestRoom(), new InputContext(RequestType.Any)))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })

  it("can handle requests sanity createDefaultCheckFor", () => {
    // expect
    expect(client.canHandleRequests()).toBeFalsy()

    // when
    client.addRequest(new Request(client.player.sessionMob, getTestRoom(), new InputContext(RequestType.Any)))

    // then
    expect(client.canHandleRequests()).toBeTruthy()

    // when
    client.player.delay += 1

    // then
    expect(client.canHandleRequests()).toBeFalsy()
  })

  describe("client sanity checks with mock services", () => {
    let send

    beforeEach(() => {
      send = jest.fn()
      const ws = jest.fn(() => ({
        send,
      }))
      const mockService = jest.fn()
      client = new Client(
        new Session(null),
        ws(),
        "127.0.0.1",
        [],
        mockService(), mockService())
    })

    it("send sanity test", () => {
      // expect
      expect(send.mock.calls.length).toBe(0)

      // when
      client.send({})

      // then
      expect(send.mock.calls.length).toBe(1)
    })

    it("should pass tick info through the socket", () => {
      // setup
      const id = "test-tick-id"
      const timestamp = new Date()

      // when
      client.tick(id, timestamp)

      // then
      expect(send.mock.calls.length).toBe(1)
      expect(send.mock.calls[0][0]).toContain("tick")
    })

    it("not logged in clients should always be able to handle requests if ones are available", () => {
      // setup
      client.player = new Player()
      client.addRequest(new AuthRequest(client, RequestType.Any))

      // expect
      expect(client.isLoggedIn()).toBeFalsy()

      // when
      client.player.delay += 1

      // then
      expect(client.canHandleRequests()).toBeTruthy()
    })
  })

  it("on result sanity test", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.ws.onmessage(getNewTestMessageEvent("hello"))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })
})

describe("clients", () => {
  it("should delegate handling requests to the session if not logged in", async () => {
    const newClient = await getTestClientLoggedOut()
    const authStep = newClient.session.getAuthStepMessage()
    newClient.addRequest(new AuthRequest(newClient, "testemail@email.com"))
    await newClient.handleNextRequest()
    expect(newClient.session.getAuthStepMessage()).not.toBe(authStep)
  })

  it("should use the default action when no actionCollection match", async () => {
    // setup
    const request = testBuilder.createRequest(RequestType.Noop)

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toEqual(MESSAGE_NOT_UNDERSTOOD)
  })

  it("invokes the default request action when input has no action handler", async () => {
    // setup
    const request = testBuilder.createRequest(RequestType.Noop)

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toContain(MESSAGE_NOT_UNDERSTOOD)
  })

  it("training will apply the cost appropriately", async () => {
    // setup
    testBuilder = new TestBuilder()
    const testClient = await testBuilder.withClient()
    testBuilder.withRoom()
    testBuilder.withMob().asTrainer()
    testClient.player.sessionMob.playerMob.trains = 1
    testClient.addRequest(testBuilder.createRequest(RequestType.Train, "train str"))

    // when
    await testClient.handleNextRequest()

    // then
    expect(testClient.getSessionMob().playerMob.trains).toBe(0)
  })

  it("satisfies event with holy silence", async () => {
    // setup
    client.getSessionMob().affect().add(newAffect(AffectType.HolySilence))
    const request = testBuilder.createRequest(RequestType.Cast)

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(SpellMessages.HolySilence.CastPrevented)
  })
})

import look from "../action/actions/look"
import { Collection } from "../action/definition/collection"
import { Player } from "../player/model/player"
import { getNewRequestFromMessageEvent, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Channel } from "../social/channel"
import { getTestClient, getTestClientLoggedOut } from "../test/client"
import { Client, getDefaultUnhandledMessage } from "./client"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"
import { default as AuthRequest } from "../session/auth/request"

function getNewTestMessageEvent(message = "hello world") {
  return new MessageEvent("test", {data: "{\"request\": \"" + message + "\"}"})
}

let client: Client

describe("clients", () => {
  beforeEach(() => client = getTestClient())
  it("should delegate handling requests to the session if not logged in", async () => {
    const newClient = getTestClientLoggedOut()
    const authStep = newClient.session.getAuthStepMessage()
    newClient.addRequest(getNewRequestFromMessageEvent(client, getNewTestMessageEvent("testemail@email.com")))
    await newClient.handleNextRequest()
    expect(newClient.session.getAuthStepMessage()).not.toBe(authStep)
  })

  it("should recognize its own messages as its own and not others", () => {
    // setup
    const message = client.createMessage(
      Channel.Gossip,
      "this is a test of the public broadcasting system",
    )

    // expect
    expect(client.isOwnMessage(message)).toBe(true)

    // when
    const anotherClient = getTestClient()
    const newMessage = anotherClient.createMessage(Channel.Gossip, "hullo")

    // then
    expect(client.isOwnMessage(newMessage)).toBe(false)
  })

  it("should be able to get a request from a result event", () => {
    // setup
    const testMessage = "this is a test"
    const testEvent = getNewTestMessageEvent(testMessage)
    const request = getNewRequestFromMessageEvent(client, testEvent) as Request

    // expect
    expect(request.player).toBe(client.player)
    expect(request.input).toEqual(testMessage)
  })

  it("should use the default actions when no handlers match", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client, getNewTestMessageEvent()) as Request
    expect.assertions(1)

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response).toEqual(getDefaultUnhandledMessage(request))
  })

  it("should be able to invoke a valid actions", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client, getNewTestMessageEvent("look")) as Request

    // when
    const response = await client.handleRequest(request)
    const lookResponse = await look(request)

    // then
    expect(response).toEqual(lookResponse)
  })

  it("invokes the default request actions when input has no actions actions", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client, getNewTestMessageEvent("foo")) as Request

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message).toContain(MESSAGE_NOT_UNDERSTOOD)
  })

  it("should pass tick info through the socket", () => {
    // setup
    const buf = []
    const ws = jest.fn(() => ({
        send: (message) => buf.push(message),
      }))
    client = new Client(ws(), "127.0.0.1", new Collection([]))
    const id = "test-tick-id"
    const timestamp = new Date()

    // expect
    expect(buf.length).toBe(0)

    // when
    client.tick(id, timestamp)

    // then
    expect(buf.length).toBe(1)
    expect(buf[0]).toContain("tick")
  })

  it("should remove a player's session mob from its room when the client shuts down", () => {
    // setup
    const room = client.player.sessionMob.room

    // expect
    expect(room.mobs).toContain(client.player.sessionMob)

    // when
    client.shutdown()

    // then
    expect(room.mobs).not.toContain(client.player.sessionMob)
  })

  it("getSessionMob sanity check", () => {
    expect(client.getSessionMob()).toBe(client.session.getMob())
  })

  it("has requests sanity check", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.addRequest(new Request(client.player, RequestType.Any))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })

  it("can handle requests sanity check", () => {
    // expect
    expect(client.canHandleRequests()).toBeFalsy()

    // when
    client.addRequest(new Request(client.player, RequestType.Any))

    // then
    expect(client.canHandleRequests()).toBeTruthy()

    // when
    client.player.delay += 1

    // then
    expect(client.canHandleRequests()).toBeFalsy()
  })

  it("create result sanity checks", () => {
    // when
    const messageString = "this is a test"
    const message = client.createMessage(Channel.Gossip, messageString)

    // then
    expect(message.message).toBe(messageString)
  })

  it("send sanity test", () => {
    // setup
    const send = jest.fn()
    const ws = jest.fn(() => ({
      send,
    }))
    client = new Client(ws(), "127.0.0.1", new Collection([]))

    // expect
    expect(send.mock.calls.length).toBe(0)

    // when
    client.send({})

    // then
    expect(send.mock.calls.length).toBe(1)
  })

  it("on result sanity test", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.ws.onmessage(getNewTestMessageEvent("hello"))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })

  it("not logged in clients should always be able to handle requests if ones are available", () => {
    // setup
    const newClient = new Client(jest.fn(), "127.0.0.1", jest.fn())
    newClient.player = new Player()
    newClient.addRequest(new AuthRequest(newClient, RequestType.Any))

    // expect
    expect(newClient.isLoggedIn()).toBeFalsy()

    // when
    newClient.player.delay += 1

    // then
    expect(newClient.canHandleRequests()).toBeTruthy()
  })
})

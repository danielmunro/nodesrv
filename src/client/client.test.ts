import { MESSAGE_ITEM_NOT_FOUND } from "../handler/action/constants"
import look from "../handler/action/look"
import { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "../handler/action/move"
import { Collection } from "../handler/definition/collection"
import { Player } from "../player/model/player"
import { createRequestArgs, getNewRequestFromMessageEvent, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Channel } from "../social/constants"
import { getTestClient, getTestClientLoggedOut } from "../test/client"
import { Client, getDefaultUnhandledMessage } from "./client"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"

function getNewTestMessageEvent(message = "hello world") {
  return new MessageEvent("test", {data: "{\"request\": \"" + message + "\"}"})
}

let client: Client

describe("clients", () => {
  beforeEach(() => client = getTestClient())
  it("should delegate handling requests to the session if not logged in", async () => {
    const newClient = getTestClientLoggedOut()
    const authStep = newClient.session.getAuthStepMessage()
    newClient.addRequest(getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent("testemail@email.com")))
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

  it("should be able to get a request from a message event", () => {
    // setup
    const testMessage = "this is a test"
    const testEvent = getNewTestMessageEvent(testMessage)
    const request = getNewRequestFromMessageEvent(client.player, testEvent)

    // expect
    expect(request.player).toBe(client.player)
    expect(request.args).toEqual(createRequestArgs(testMessage))
  })

  it("should use the default handler when no handlers match", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent())
    expect.assertions(1)

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response).toEqual(getDefaultUnhandledMessage())
  })

  it("should be able to invoke a valid handler", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent("look"))

    // when
    const response = await client.handleRequest(request)
    const lookResponse = await look(request)

    // then
    expect(response).toEqual(lookResponse)
  })

  it("should invoke east before equipped", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent("e"))

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("should invoke west before wear", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent("w"))

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message).toContain(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("should invoke get before gossip", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent("g"))

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message).toContain(MESSAGE_ITEM_NOT_FOUND)
  })

  it("invokes the default request handler when input has no action handler", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client.player, getNewTestMessageEvent("foo"))

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
    client = new Client(ws(), new Collection([]))
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

  it("create message sanity checks", () => {
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
    client = new Client(ws(), new Collection([]))

    // expect
    expect(send.mock.calls.length).toBe(0)

    // when
    client.send({})

    // then
    expect(send.mock.calls.length).toBe(1)
  })

  it("on message sanity test", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.ws.onmessage(getNewTestMessageEvent("hello"))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })

  it("not logged in clients should always be able to handle requests if ones are available", () => {
    // setup
    const newClient = new Client(jest.fn(), jest.fn())
    newClient.addRequest(new Request(newClient.player, RequestType.Any))
    newClient.player = new Player()

    // expect
    expect(newClient.isLoggedIn()).toBeFalsy()

    // when
    newClient.player.delay += 1

    // then
    expect(newClient.canHandleRequests()).toBeTruthy()
  })
})

import { HandlerCollection } from "../handler/handlerCollection"
import look from "./../handler/action/look"
import { getNewRequestFromMessageEvent } from "./../server/request/request"
import { Channel } from "./../social/constants"
import { getTestClient } from "./../test/client"
import { getTestPlayer } from "./../test/player"
import { Client, getDefaultUnhandledMessage } from "./client"

function getNewTestMessageEvent(message = "hello world") {
  return new MessageEvent("test", {data: "{\"request\": \"" + message + "\"}"})
}

describe("clients", () => {
  it("should return the expected player", () => {
    const player = getTestPlayer()
    const client = getTestClient(player)
    expect(client.getPlayer()).toEqual(player)
  })

  it("should recognize its own messages as its own and not others", () => {
    const client = getTestClient()
    const message = client.createMessage(
      Channel.Gossip,
      "this is a test of the public broadcasting system",
    )
    expect(client.isOwnMessage(message)).toBe(true)

    const anotherClient = getTestClient()
    const newMessage = anotherClient.createMessage(Channel.Gossip, "hullo")
    expect(client.isOwnMessage(newMessage)).toBe(false)
  })

  it("should be able to get a request from a message event", () => {
    const client = getTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent())
    expect(request.player).toBe(client.getPlayer())
    expect(request.args).toEqual({ request: "hello world" })
  })

  it("should use the default handler when no handlers match", () => {
    const client = getTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent())

    expect.assertions(1)
    return client.handleRequest(request)
      .then((response) => expect(response).toEqual(getDefaultUnhandledMessage()))
  })

  it("should be able to invoke a valid handler", () => {
    const client = getTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent("look"))

    expect.assertions(1)
    return Promise.all([
      client.handleRequest(request),
      look(request),
    ]).then(([response, lookResponse]) => expect(response).toEqual(lookResponse))
  })

  it("should invoke east before equipped", () => {
    const client = getTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent("e"))

    expect.assertions(1)
    return client.handleRequest(request).then((response) =>
      expect(response.message).toContain("that direction does not exist"))
  })

  it("should invoke west before wear", () => {
    const client = getTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent("w"))

    expect.assertions(1)
    return client.handleRequest(request).then((response) =>
      expect(response.message).toContain("that direction does not exist"))
  })

  it("should invoke get before gossip", () => {
    const client = getTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent("g"))

    expect.assertions(1)
    return client.handleRequest(request).then((response) =>
      expect(response.message).toContain("You can't find that anywhere."))
  })

  it("should pass tick info through the socket", () => {
    const buf = []
    const ws = jest.fn(() => {
      return {
        send: (message) => buf.push(message),
      }
    })
    const client = new Client(ws(), getTestPlayer(), new HandlerCollection([]))
    const id = "test-tick-id"
    const timestamp = new Date()
    expect(buf).toEqual([])
    client.tick(id, timestamp)
    expect(buf.length).toBe(1)
    expect(buf[0]).toContain("tick")
  })
})

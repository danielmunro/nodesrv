import { WebSocket } from "mock-socket"
import { handlers, look } from "./../server/handler/handlers"
import { getNewRequestFromMessageEvent } from "./../server/request/request"
import { Channel } from "./../social/constants"
import { getTestPlayer } from "./../test/player"
import { Client, getDefaultUnhandledMessage } from "./client"

function getNewTestClient(player = getTestPlayer()): Client {
  return new Client(new WebSocket("ws://localhost:1111"), player, handlers)
}

function getNewTestMessageEvent(message = "hello world") {
  return new MessageEvent("test", {data: "{\"request\": \"" + message + "\"}"})
}

describe("clients", () => {
  it("should return the expected player", () => {
    const player = getTestPlayer()
    const client = getNewTestClient(player)
    expect(client.getPlayer()).toEqual(player)
  })

  it("should recognize its own messages as its own and not others", () => {
    const client = getNewTestClient()
    const message = client.createMessage(
      Channel.Gossip,
      "this is a test of the public broadcasting system",
    )
    expect(client.isOwnMessage(message)).toBe(true)

    const anotherClient = getNewTestClient()
    const newMessage = anotherClient.createMessage(Channel.Gossip, "hullo")
    expect(client.isOwnMessage(newMessage)).toBe(false)
  })

  it("should be able to get a request from a message event", () => {
    const client = getNewTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent())
    expect(request.player).toBe(client.getPlayer())
    expect(request.args).toEqual({ request: "hello world" })
  })

  it("should use the default handler when no handlers match", () => {
    const client = getNewTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent())

    expect.assertions(1)
    return client.onRequest(request)
      .then((response) => expect(response).toEqual(getDefaultUnhandledMessage()))
  })

  it("should be able to invoke a valid handler", () => {
    const client = getNewTestClient()
    const request = getNewRequestFromMessageEvent(client.getPlayer(), getNewTestMessageEvent("look"))

    expect.assertions(1)
    return Promise.all([
      client.onRequest(request),
      look(request),
    ]).then(([response, lookResponse]) => expect(response).toEqual(lookResponse))
  })
})

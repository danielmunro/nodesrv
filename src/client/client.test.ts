import { WebSocket } from "mock-socket"
import { v4 } from "uuid"
import { Player } from "./../player/player"
import { Channel } from "./../social/channel"
import { Message } from "./../social/message"
import { Client } from "./client"

function getNewTestClient(player = new Player()): Client {
  return new Client(new WebSocket("ws://localhost:1111"), player)
}

test("getPlayer()", () => {
  const player = new Player()
  const client = getNewTestClient(player)
  expect(client.getPlayer()).toEqual(player)
})

test("isOwnMessage()", () => {
  const client = getNewTestClient()
  const message = new Message(client.getPlayer(), Channel.Gossip, "this is a test of the public broadcasting system")
  expect(client.isOwnMessage(message)).toBe(true)

  const anotherClient = getNewTestClient()
  const newMessage = new Message(anotherClient.getPlayer(), Channel.Gossip, "hullo")
  expect(client.isOwnMessage(newMessage)).toBe(false)
})

test("getNewRequestFromMessageEvent()", () => {
  const messageEvent = new MessageEvent("test", {data: "{\"message\": \"hello world\"}"})
  const client = getNewTestClient()
  const request = client.getNewRequestFromEvent(messageEvent)
  expect(request.getPlayer()).toBe(client.getPlayer())
  expect(request.getArgs()).toEqual({ message: "hello world" })
})

import { WebSocket } from "mock-socket"
import { Channel } from "./../social/channel"
import { Message } from "./../social/message"
import { Client } from "./client"

function getNewTestClient(): Client {
  return new Client(new WebSocket("ws://localhost:1111"))
}

test("isOwnMessage() sanity checks", () => {
  const client = getNewTestClient()
  const message = new Message(client.getPlayer(), Channel.Gossip, "this is a test of the public broadcasting system")
  expect(client.isOwnMessage(message)).toBe(true)

  const anotherClient = getNewTestClient()
  const newMessage = new Message(anotherClient.getPlayer(), Channel.Gossip, "hullo")
  expect(client.isOwnMessage(newMessage)).toBe(false)
})

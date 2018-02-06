import { WebSocket } from "mock-socket"
import { Client } from "./client"
import { Message } from "./social/message"
import { Channel } from "./social/channel"

function getNewTestClient(): Client {
  return new Client(new WebSocket('ws://localhost:1111'))
}

test("isOwnMessage() sanity checks", () => {
  const client = getNewTestClient()
  const message = new Message(client.getPlayer(), Channel.Gossip, "this is a test of the public broadcasting system")
  expect(client.isOwnMessage(message)).toBe(true)

  const anotherClient = getNewTestClient()
  const newMessage = new Message(anotherClient.getPlayer(), Channel.Gossip, "hullo")
  expect(client.isOwnMessage(newMessage)).toBe(false)
})

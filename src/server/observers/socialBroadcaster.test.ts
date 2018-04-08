import { Client } from "../../client/client"
import { Player } from "../../player/model/player"
import { broadcastMessage } from "../../social/chat"
import { Channel } from "../../social/constants"
import { Message } from "../../social/message"
import { SocialBroadcaster } from "./socialBroadcaster"

jest.mock("../../client/client")

function getMockClient(): Client {
  const client = new Client()
  client.player = new Player()
  client.isOwnMessage = (m: Message) => m.sender === client.player

  return client
}

describe("socialBroadcaster", () => {
  it("should notify all clients when a client sends a message, except the sender", () => {
    const socialBroadcaster = new SocialBroadcaster()
    const client1 = getMockClient()
    const client2 = getMockClient()
    const client3 = getMockClient()

    broadcastMessage(client1.player, Channel.Gossip, "hello world")
    socialBroadcaster.notify([
      client1,
      client2,
      client3,
    ])

    expect(client1.send.mock.calls.length).toBe(0)
    expect(client2.send.mock.calls.length).toBe(1)
    expect(client3.send.mock.calls.length).toBe(1)
  })
})

import { Client } from "../../client/client"
import { Player } from "../../player/model/player"
import Complete from "../../session/auth/complete"
import Session from "../../session/session"
import { Channel } from "../../social/channel"
import { Message } from "../../social/message"
import { broadcastPrivateMessage } from "../../social/privateBroadcast"
import { broadcastMessage, readMessages } from "../../social/publicBroadcast"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { SocialBroadcaster } from "./socialBroadcaster"

jest.mock("../../client/client")

async function getMockClient(room = getTestRoom()): Promise<Client> {
  const client = new Client(null, null, null, null)
  client.player = new Player()
  client.isOwnMessage = (m: Message) => m.sender === client.player
  client.isLoggedIn = () => true
  client.session = new Session(client, new Complete(client.player))
  client.startRoom = room
  client.player.sessionMob = getTestMob()
  await client.session.login(client.player)

  return client
}

describe("socialBroadcaster", () => {
  it("should notify all clients when a client sends a result, except the sender", async () => {
    readMessages()
    const socialBroadcaster = new SocialBroadcaster()
    const client1 = await getMockClient()
    const client2 = await getMockClient()
    const client3 = await getMockClient()

    broadcastMessage(client1.player, Channel.Gossip, "hello world")
    socialBroadcaster.notify([
      client1,
      client2,
      client3,
    ])

    expect(client1.send.mock.calls.length).toBe(2)
    expect(client2.send.mock.calls.length).toBe(3)
    expect(client3.send.mock.calls.length).toBe(3)
  })

  it("should notify only clients in the same private channel", async () => {
    readMessages()
    const room1 = getTestRoom()
    room1.uuid = "123"
    const room2 = getTestRoom()
    room2.uuid = "456"
    const socialBroadcaster = new SocialBroadcaster()
    const client1 = await getMockClient(room1)
    const client2 = await getMockClient(room1)
    const client3 = await getMockClient(room2)
    broadcastPrivateMessage(room1.uuid, client1.player, Channel.Say, "hello world")
    socialBroadcaster.notify([
      client1,
      client2,
      client3,
    ])

    expect(client1.send.mock.calls.length).toBe(2)
    expect(client2.send.mock.calls.length).toBe(3)
    expect(client3.send.mock.calls.length).toBe(2)
  })
})

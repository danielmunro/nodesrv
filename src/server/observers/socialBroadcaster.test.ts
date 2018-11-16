import { Client } from "../../client/client"
import Service from "../../service/service"
import Complete from "../../session/auth/complete"
import Session from "../../session/session"
import { Channel } from "../../social/channel"
import { Message } from "../../social/message"
import { broadcastPrivateMessage } from "../../social/privateBroadcast"
import { broadcastMessage, readMessages } from "../../social/publicBroadcast"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { SocialBroadcaster } from "./socialBroadcaster"
import LocationService from "../../mob/locationService"
import { newMobLocation } from "../../mob/factory"

jest.mock("../../client/client")

async function getMockClient(room = getTestRoom()): Promise<Client> {
  const client = new Client(null, null, null, null, null, null)
  client.service = await Service.new()
  client.player = getTestPlayer()
  client.session = new Session(client, new Complete(client.player))
  client.player.sessionMob = getTestMob()
  client.getSessionMob = () => client.player.sessionMob
  client.isOwnMessage = (m: Message) => m.sender.uuid === client.player.sessionMob.uuid
  client.isLoggedIn = () => true
  client.getStartRoom = () => room
  await client.session.login(client.player)

  return client
}

describe("socialBroadcaster", () => {
  it("should notify all clients when a client sends a result, except the sender", async () => {
    readMessages()
    const room = getTestRoom()
    const client1 = await getMockClient()
    const client2 = await getMockClient()
    const client3 = await getMockClient()
    const socialBroadcaster = new SocialBroadcaster(new LocationService([
      newMobLocation(client1.getSessionMob(), room),
      newMobLocation(client2.getSessionMob(), room),
      newMobLocation(client3.getSessionMob(), room),
    ]))

    broadcastMessage(client1.player.sessionMob, Channel.Gossip, "first test")
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
    const room2 = getTestRoom()
    const client1 = await getMockClient()
    const client2 = await getMockClient()
    const client3 = await getMockClient()
    const socialBroadcaster = new SocialBroadcaster(new LocationService([
      newMobLocation(client1.getSessionMob(), room1),
      newMobLocation(client2.getSessionMob(), room1),
      newMobLocation(client3.getSessionMob(), room2),
    ]))
    broadcastPrivateMessage(room1.uuid, client1.getSessionMob(), Channel.Say, "second test")
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

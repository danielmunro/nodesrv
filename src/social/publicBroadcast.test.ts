import { getTestPlayer } from "../test/player"
import { Channel } from "./channel"
import { broadcastMessage, readMessages } from "./publicBroadcast"

const testMessage = "hello world"

describe("chat", () => {
  it("should be able to broadcast and receive messages", () => {
    // given
    const player = getTestPlayer()

    // when
    broadcastMessage(player, Channel.Gossip, testMessage)

    // then
    const messages = readMessages()
    expect(messages.length).toBe(1)
    expect(messages[0].sender).toBe(player)
    expect(messages[0].channel).toBe(Channel.Gossip)
    expect(messages[0].message).toBe(testMessage)
  })

  it("should not broadcast the same result more than once", () => {
    // given
    const player = getTestPlayer()

    // expect
    expect(readMessages().length).toBe(0)

    // when
    broadcastMessage(player, Channel.Gossip, testMessage)

    // then
    expect(readMessages().length).toBe(1)
    expect(readMessages().length).toBe(0)
  })
})

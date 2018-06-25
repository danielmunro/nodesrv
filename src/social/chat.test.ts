import { getTestPlayer } from "./../test/player"
import { broadcastMessage, readMessages } from "./chat"
import { Channel } from "./constants"

describe("chat", () => {
  it("should be able to broadcast and receive messages", () => {
    const player = getTestPlayer()
    const message = "hello world"
    broadcastMessage(
      player,
      Channel.Gossip,
      message,
    )
    const messages = readMessages()
    expect(messages.length).toBe(1)
    expect(messages[0].sender).toBe(player)
    expect(messages[0].channel).toBe(Channel.Gossip)
    expect(messages[0].message).toBe(message)
  })

  it("should not broadcast the same result more than once", () => {
    const player = getTestPlayer()
    const message = "hello world"
    expect(readMessages().length).toBe(0)
    broadcastMessage(
      player,
      Channel.Gossip,
      message,
    )
    expect(readMessages().length).toBe(1)
    expect(readMessages().length).toBe(0)
  })
})

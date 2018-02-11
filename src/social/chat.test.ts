import { Player } from "./../player/player"
import { getTestPlayer } from "./../test/common"
import { Channel } from "./channel"
import { broadcastMessage, readMessages } from "./chat"

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
    expect(messages[0].getSender()).toBe(player)
    expect(messages[0].getChannel()).toBe(Channel.Gossip)
    expect(messages[0].getMessage()).toBe(message)
    expect(readMessages().length).toBe(0)
  })
})

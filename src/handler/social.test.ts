import { readMessages } from "../social/chat"
import { getTestPlayer } from "../test/player"
import { gossip } from "./social"

describe("social", () => {
  it("gossip should produce a result to the social buffer", () => {
    const player = getTestPlayer()
    const messageStr = "this is a test"
    const message = gossip(player, messageStr)
    expect(message.sender).toBe(player)
    expect(message.message).toBe(messageStr)
    expect(readMessages()).toContain(message)
  })
})

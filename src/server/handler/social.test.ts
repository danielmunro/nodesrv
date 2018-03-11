import { gossip } from "./social"
import { getTestPlayer } from "../../test/player"
import { readMessages } from "../../social/chat"

describe("social", () => {
  it("gossip should produce a message to the social buffer", () => {
    const player = getTestPlayer()
    const messageStr = "this is a test"
    const message = gossip(player, messageStr)
    expect(message.sender).toBe(player)
    expect(message.message).toBe(messageStr)
    expect(readMessages()).toContain(message)
  })
})
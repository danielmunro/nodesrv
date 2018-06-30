import * as stringify from "json-stringify-safe"
import * as v4 from "uuid"
import { getTestPlayer } from "../test/player"
import { Channel } from "./channel"
import { Message } from "./message"

describe("message", () => {
  it("should include relevant data in getData() request", () => {
    const player = getTestPlayer()
    player.uuid = v4()
    const messageString = "this is a test result"
    const message = new Message(
      player,
      Channel.Gossip,
      messageString,
    )
    const data = stringify(message.getData())
    expect(data).toContain(messageString)
    expect(data).toContain(player.uuid)
    expect(data).toContain(Channel.Gossip)
  })
})

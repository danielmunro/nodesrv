import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import { Channel } from "./channel"
import { broadcastPrivateMessage, readPrivateMessages } from "./privateBroadcast"

const testMessage = "hello world"

describe("private social broadcast", () => {
  it("should be able to publish to a private channel", () => {
    // given
    const uniqueId = "this-id-is-unique"
    const mob = getTestMob()

    // when
    broadcastPrivateMessage(uniqueId, mob, Channel.Say, testMessage)

    // then
    const privateMessageBatch = readPrivateMessages()
    expect(privateMessageBatch[uniqueId]).toBeDefined()
    expect(privateMessageBatch[uniqueId][0].message).toBe(testMessage)
  })

  it("reading private messages should clear the queue", () => {
    // given
    const uniqueId = "this-id-is-unique"
    const mob = getTestMob()

    // when
    broadcastPrivateMessage(uniqueId, mob, Channel.Say, testMessage)

    // then
    const privateMessageBatch1 = readPrivateMessages()
    expect(privateMessageBatch1[uniqueId]).toBeDefined()

    // and
    const privateMessageBatch2 = readPrivateMessages()
    expect(privateMessageBatch2[uniqueId]).toBeUndefined()
  })
})

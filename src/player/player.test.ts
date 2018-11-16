import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import TestBuilder from "../test/testBuilder"

describe("player model", () => {
  it("should be able to add a mob to a room", async () => {
    const testBuilder = new TestBuilder()
    const initialRoom = testBuilder.withRoom().room
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const destinationRoom = testBuilder.withRoom().room
    expect(initialRoom.mobs.length).toBe(1)
    expect(destinationRoom.mobs.length).toBe(0)
    player.moveTo(destinationRoom)
    expect(initialRoom.mobs.length).toBe(0)
    expect(destinationRoom.mobs.length).toBe(1)
  })

  it("should not own a random mob", () => {
    const player = getTestPlayer()
    const mob = getTestMob()
    expect(player.ownsMob(mob)).toBeFalsy()
  })
})

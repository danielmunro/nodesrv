import { getTestPlayer } from "../test/player"
import { getTestRoom } from "../test/room"

describe("player model?", () => {
  it("should be able to add a mob to a room", () => {
    const player = getTestPlayer()
    const initialRoom = player.sessionMob.room
    const destinationRoom = getTestRoom()
    // expect(initialRoom.mobs.length).toBe(1)
    expect(destinationRoom.mobs.length).toBe(0)
    player.moveTo(destinationRoom)
    expect(initialRoom.mobs.length).toBe(0)
    expect(destinationRoom.mobs.length).toBe(1)
    expect(1).toBe(1)
  })
})

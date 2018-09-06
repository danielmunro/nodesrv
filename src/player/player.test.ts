import { Direction } from "../room/constants"
import { Exit } from "../room/model/exit"
import { getTestPlayer } from "../test/player"
import { getTestRoom } from "../test/room"
import { getTestMob } from "../test/mob"

describe("player model", () => {
  it("should be able to add a mob to a room", () => {
    const player = getTestPlayer()
    const initialRoom = player.sessionMob.room
    const destinationRoom = getTestRoom()
    expect(initialRoom.mobs.length).toBe(1)
    expect(destinationRoom.mobs.length).toBe(0)
    player.moveTo(destinationRoom)
    expect(initialRoom.mobs.length).toBe(0)
    expect(destinationRoom.mobs.length).toBe(1)
  })

  it("should be able to get exits for the room it is in", () => {
    const player = getTestPlayer()
    const room1 = player.sessionMob.room
    const room2 = getTestRoom()
    const exit = new Exit()
    exit.source = room1
    exit.destination = room2
    exit.direction = Direction.North
    room1.exits.push(exit)
    expect(player.getExit(Direction.North)).toBe(exit)
    expect(player.getExit(Direction.South)).toBeUndefined()
  })

  it("should not own a random mob", () => {
    const player = getTestPlayer()
    const mob = getTestMob()
    expect(player.ownsMob(mob)).toBeFalsy()
  })
})

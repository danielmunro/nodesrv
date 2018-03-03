import { v4 } from "uuid"
import { getTestMob } from "./../test/mob"
import { getTestRoom } from "./../test/room"
import { allDirections } from "./constants"
import { Exit } from "./exit"
import { Room } from "./room"

describe("a room", () => {
  it("should be able to return its exits", () => {
    const exits = allDirections.map((direction) => new Exit(v4(), direction))
    const room = new Room(
      v4(),
      "room name",
      "room description",
      exits)
    exits.map((exit) => expect(room.getExit(exit.direction).roomID).toEqual(exit.roomID))
  })

  it("should be able to add and remove mobs", () => {
    const room = getTestRoom()
    const mob = getTestMob()
    expect(room).not.toEqual(mob.getRoom())
    room.addMob(mob)
    expect(room.getMobs().length).toBe(1)
    expect(room).toBe(mob.getRoom())
    room.removeMob(mob)
    expect(room.getMobs().length).toBe(0)
  })
})

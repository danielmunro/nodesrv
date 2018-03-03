import * as v4 from "uuid"
import { Room } from "./../room/room"
import { getTestPlayer } from "./../test/player"
import { getTestRoom } from "./../test/room"

describe("players", () => {
  it("should be able to describe the exits for the room they are in", () => {
    const player = getTestPlayer()
    const exit = getTestRoom().exits[0]
    expect(player.getExit(exit.direction)).toEqual(exit)
  })

  it("should be able to move between rooms", () => {
    const player = getTestPlayer()
    const moveToRoom = new Room(v4(), "name", "description", [])
    expect(player.getRoom()).not.toEqual(moveToRoom)
    player.moveTo(moveToRoom)
    expect(player.getRoom()).toEqual(moveToRoom)
  })

  it("should be able to return its mob", () => {
    const player = getTestPlayer()
    expect(player.getMob()).not.toBeNull()
  })
})

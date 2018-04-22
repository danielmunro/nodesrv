import { newCritter } from "../mob/factory/trail"
import { Direction } from "../room/constants"
import { Room } from "../room/model/room"
import { Arena } from "./arena"

describe("arena", () => {
  it("should build a matrix of requested size", () => {
    const width = 5
    const height = 6
    const arena = new Arena(new Room(), width, height, newCritter)
    expect(arena.matrix.length).toBe(height)
    arena.matrix.forEach((row) => expect(row.length).toBe(width))
  })

  it("should have directional exits connecting each room", () => {
    const width = 5
    const height = 6
    const arena = new Arena(new Room(), width, height, newCritter)

    arena.matrix.forEach((row, y) => row.forEach((room: Room, x) => {
      // below conditionals cover the random connection of the root room
      if (x > 0) {
        expect(room.isDirectionFree(Direction.North)).toBe(y === 0)
      }
      if (y > 0) {
        expect(room.isDirectionFree(Direction.West)).toBe(x === 0)
      }
      expect(room.isDirectionFree(Direction.East)).toBe(x === width - 1)
      expect(room.isDirectionFree(Direction.South)).toBe(y === height - 1)

      // arenas do not extend up or down
      expect(room.isDirectionFree(Direction.Up)).toBe(true)
      expect(room.isDirectionFree(Direction.Down)).toBe(true)
    }))
  })
})

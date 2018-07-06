import { newCritter } from "../mob/factory/trail"
import { Direction } from "../room/constants"
import { Room } from "../room/model/room"
import { persistRoom } from "../room/service"
import { getTestRoom } from "../test/room"
import { Arena } from "./arena"

const width = 5
const height = 6
let arena

describe("arena", () => {
  beforeEach(async () => {
    const room = await persistRoom(getTestRoom())
    arena = new Arena(room, width, height, newCritter)
    await arena.buildMatrix()
  })

  it("should build a matrix of requested size", () => {
    expect(arena.matrix.length).toBe(height)
    arena.matrix.forEach((row) => expect(row.length).toBe(width))
  })

  it("should have directional exits connecting each room", () => {
    arena.matrix.forEach((row, y) => row.forEach((room: Room, x) => {
      // edges of arena
      if (x === 0) {
        expect(room.isDirectionFree(Direction.East)).toBe(false)
      }

      if (y === 0) {
        expect(room.isDirectionFree(Direction.South)).toBe(false)
      }

      if (x === row.length - 1) {
        expect(room.isDirectionFree(Direction.West)).toBe(false)
      }

      if (y === arena.matrix.length - 1) {
        expect(room.isDirectionFree(Direction.North)).toBe(false)
      }

      // non-edges of marina
      if (x > 0 && x < row.length - 1 && y > 0 && y < arena.matrix.length - 1) {
        expect(room.isDirectionFree(Direction.North)).toBe(false)
        expect(room.isDirectionFree(Direction.East)).toBe(false)
        expect(room.isDirectionFree(Direction.South)).toBe(false)
        expect(room.isDirectionFree(Direction.West)).toBe(false)
      }

      // arenas are flat
      expect(room.isDirectionFree(Direction.Up)).toBe(true)
      expect(room.isDirectionFree(Direction.Down)).toBe(true)
    }))
  })
})

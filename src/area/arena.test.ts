import { newCritter } from "../mob/factory/trail"
import { Direction } from "../room/constants"
import { newReciprocalExit } from "../room/factory"
import { Room } from "../room/model/room"
import { getTestRoom } from "../test/room"
import { Arena } from "./arena"
import { newArena } from "./factory"

const width = 5
const height = 6
let arena

describe("arena", () => {
  beforeEach(() => arena = new Arena(new Room(), width, height, newCritter))

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

  it("should not allow a root room with no available connections", async () => {
    // setup
    const rootRoom = getTestRoom()
    const connected1 = getTestRoom()
    const connected2 = getTestRoom()
    const connected3 = getTestRoom()
    const connected4 = getTestRoom()

    // when
    newReciprocalExit(Direction.North, rootRoom, connected1)
    newReciprocalExit(Direction.South, rootRoom, connected2)
    newReciprocalExit(Direction.East, rootRoom, connected3)
    newReciprocalExit(Direction.West, rootRoom, connected4)

    // then
    expect(rootRoom.exits.length).toBe(4)
    expect(newArena(rootRoom, 2, 2)).rejects.toThrowError()
  })

  it("should not allow a root room with no available connections", async () => {
    // setup
    const rootRoom = getTestRoom()
    const connected1 = getTestRoom()
    const connected2 = getTestRoom()
    const connected3 = getTestRoom()

    // when
    newReciprocalExit(Direction.North, rootRoom, connected1)
    newReciprocalExit(Direction.South, rootRoom, connected2)
    newReciprocalExit(Direction.East, rootRoom, connected3)

    // then
    expect(rootRoom.exits.length).toBe(3)
    expect(await newArena(rootRoom, 2, 2)).toBeTruthy()
  })
})

import { Direction } from "./constants"

export function reverse(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Down
    case Direction.Down:
      return Direction.Up
    case Direction.North:
      return Direction.South
    case Direction.South:
      return Direction.North
    case Direction.East:
      return Direction.West
    case Direction.West:
      return Direction.East
  }
}

import { allDirections, Direction } from "./constants"
import { Room } from "./model/room"

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

export function getFreeDirection(room: Room) {
  const availableDirections = allDirections
    .filter((d) => !room.exits.find((e) => e.direction === d) && d !== Direction.Up && d !== Direction.Down)

  return availableDirections[Math.floor(Math.random() * availableDirections.length)]
}

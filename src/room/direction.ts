import { pickOne } from "../random/helpers"
import { Direction, nsewDirections } from "./constants"
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
  const availableDirections = nsewDirections.filter((d) => !room.exits.find((e) => e.direction === d))

  return pickOne(availableDirections)
}

export function getFreeReciprocalDirection(source: Room, destination: Room) {
  const availableDirections = nsewDirections.filter(
    (d) => source.isDirectionFree(d) && destination.isDirectionFree(reverse(d)))
  return pickOne(availableDirections)
}

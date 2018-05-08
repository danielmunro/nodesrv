import { pickOne } from "../random/helpers"
import { cardinalDirections, Direction } from "./constants"
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

export function getFreeDirection(room: Room): Direction {
  return pickOne(cardinalDirections.filter((d) => !room.exits.find((e) => e.direction === d)))
}

export function getFreeReciprocalDirection(source: Room, destination: Room) {
  return pickOne(cardinalDirections.filter(
    (d) => source.isDirectionFree(d) && destination.isDirectionFree(reverse(d))))
}

export function isCardinalDirection(direction: Direction): boolean {
  return direction === Direction.North
    || direction === Direction.South
    || direction === Direction.East
    || direction === Direction.West
}

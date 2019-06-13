import { pickOne } from "../support/random/helpers"
import { cardinalDirections} from "./constants"
import { RoomEntity } from "./entity/roomEntity"
import {Direction} from "./enum/direction"

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
  return Direction.Noop
}

export function isReciprocalFree(direction: Direction, room1: RoomEntity, room2: RoomEntity) {
  return room1.isDirectionFree(direction) && room2.isDirectionFree(reverse(direction))
}

export function getFreeDirection(room: RoomEntity): Direction {
  return pickOne(cardinalDirections.filter((d) => !room.exits.find((e) => e.direction === d)))
}

export function getFreeReciprocalDirection(source: RoomEntity, destination: RoomEntity) {
  return pickOne(cardinalDirections.filter(
    (d) => source.isDirectionFree(d) && destination.isDirectionFree(reverse(d))))
}

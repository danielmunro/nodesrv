import Maybe from "../support/functional/maybe/maybe"
import {pickOne} from "../support/random/helpers"
import {cardinalDirections} from "./constants"
import {RoomEntity} from "./entity/roomEntity"
import {Direction} from "./enum/direction"

const directionMap = [
  [ Direction.Up, Direction.Down ],
  [ Direction.Down, Direction.Up ],
  [ Direction.North, Direction.South ],
  [ Direction.South, Direction.North ],
  [ Direction.East, Direction.West ],
  [ Direction.West, Direction.East ],
]

function getFromDirectionMap(direction: Direction) {
  const map = directionMap.find(m => m[0] === direction)
  return map ? map[1] : undefined
}

export function reverse(direction: Direction): Direction {
  return new Maybe<Direction>(getFromDirectionMap(direction))
    .or(() => Direction.Noop)
    .get()
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

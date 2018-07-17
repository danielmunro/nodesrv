import roll from "../random/dice"
import { allDirections, Direction } from "./constants"
import { getFreeReciprocalDirection, isReciprocalFree, reverse } from "./direction"
import { Exit } from "./model/exit"
import { Room } from "./model/room"

export function newRoom(name: string, description: string, mobs = []): Room {
  const room = new Room()
  room.name = name
  room.description = description
  room.mobs = mobs

  return room
}

export function newExit(direction: Direction, source: Room, destination: Room): Exit {
  const exit = new Exit()
  exit.direction = direction
  exit.source = source
  exit.destination = destination
  source.exits.push(exit)

  return exit
}

export function newReciprocalExit(source: Room, destination: Room, direction: Direction = null): Exit[] {
  if (direction === null) {
    direction = getFreeReciprocalDirection(source, destination)
  }

  if (!allDirections.includes(direction)) {
    direction = roll(1, 2) === 1 ? Direction.Up : Direction.Down
    console.debug(`new reciprocal exit falling back to non-cardinal direction ${direction}`)

    if (!isReciprocalFree(direction, source, destination)) {
      direction = reverse(direction)
      console.debug(`last new reciprocal exit attempt with direction ${direction}`)
    }

    if (!isReciprocalFree(direction, source, destination)) {
      throw new Error("No connection can be made")
    }
  }

  if (source === destination) {
    throw new Error("Cannot connect a room to itself")
  }

  return [
    newExit(direction, source, destination),
    newExit(reverse(direction), destination, source),
  ]
}

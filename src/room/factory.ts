import { Direction } from "./constants"
import { reverse } from "./direction"
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

  return exit
}

export function newReciprocalExit(direction: Direction, source: Room, destination: Room): Exit[] {
  return [
    newExit(direction, source, destination),
    newExit(reverse(direction), destination, source),
  ]
}

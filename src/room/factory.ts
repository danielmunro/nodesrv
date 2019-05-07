import {Terrain} from "../region/enum/terrain"
import newRegion from "../region/factory"
import roll from "../support/random/dice"
import {allDirections, Direction} from "./constants"
import {getFreeReciprocalDirection, isReciprocalFree, reverse} from "./direction"
import ExitTable from "./exitTable"
import Door from "./model/door"
import {Exit} from "./model/exit"
import {Room} from "./model/room"
import {getExitRepository} from "./repository/exit"
import {getRoomRepository} from "./repository/room"
import {default as RoomTable} from "./roomTable"

export function newDoor(name: string, isClosed: boolean, isLocked: boolean, unlockedById?: number): Door {
  const door = new Door()
  door.name = name
  door.isClosed = isClosed
  door.isLocked = isLocked
  door.unlockedByCanonicalId = unlockedById as number
  return door
}

export function newRoom(name: string, description: string, items = []): Room {
  const room = new Room()
  room.name = name
  room.description = description
  items.forEach((item) => room.inventory.addItem(item))
  room.region = newRegion("test", Terrain.Settlement)

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

export function newReciprocalExit(
  source: Room,
  destination: Room,
  direction: Direction = getFreeReciprocalDirection(source, destination)): Exit[] {
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

export async function newRoomTable(): Promise<RoomTable> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.findAll()
  return RoomTable.new(models)
}

export async function newExitTable(): Promise<ExitTable> {
  const exitRepository = await getExitRepository()
  const models = await exitRepository.findAll()
  return new ExitTable(models)
}

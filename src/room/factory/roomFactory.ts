import {createInventory} from "../../item/factory/inventoryFactory"
import {Terrain} from "../../region/enum/terrain"
import newRegion from "../../region/factory/regionFactory"
import roll from "../../support/random/dice"
import {allDirections} from "../constants"
import DoorEntity from "../entity/doorEntity"
import {ExitEntity} from "../entity/exitEntity"
import {RoomEntity} from "../entity/roomEntity"
import {Direction} from "../enum/direction"
import {getExitRepository} from "../repository/exit"
import {getRoomRepository} from "../repository/room"
import {reverse} from "../service/direction"
import ExitTable from "../table/exitTable"
import {default as RoomTable} from "../table/roomTable"

export function newDoor(name: string, isClosed: boolean, isLocked: boolean, unlockedById?: number): DoorEntity {
  const door = new DoorEntity()
  door.name = name
  door.isClosed = isClosed
  door.isLocked = isLocked
  door.unlockedByCanonicalId = unlockedById as number
  return door
}

export function newRoom(name: string, description: string, items = []): RoomEntity {
  const room = createRoom()
  room.name = name
  room.description = description
  items.forEach((item) => room.inventory.addItem(item))
  room.region = newRegion("test", Terrain.Settlement)

  return room
}

export function createRoom(): RoomEntity {
  const room = new RoomEntity()
  room.exits = []
  room.entrances = []
  room.inventory = createInventory()
  room.mobResets = []
  return room
}

export function newExit(direction: Direction, source: RoomEntity, destination: RoomEntity): ExitEntity {
  const exit = new ExitEntity()
  exit.direction = direction
  exit.source = source
  exit.destination = destination
  source.exits.push(exit)

  return exit
}

export function newReciprocalExit(
  source: RoomEntity,
  destination: RoomEntity,
  direction: Direction = source.getUnusedReciprocalDirection(destination)): ExitEntity[] {
  if (!allDirections.includes(direction)) {
    direction = roll(1, 2) === 1 ? Direction.Up : Direction.Down
    console.debug(`new reciprocal exit falling back to non-cardinal direction ${direction}`)

    if (!source.isReciprocalDirectionFree(destination, direction)) {
      direction = reverse(direction)
      console.debug(`last new reciprocal exit attempt with direction ${direction}`)
    }

    if (!source.isReciprocalDirectionFree(destination, direction)) {
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

/* istanbul ignore next */
export async function newRoomTable(): Promise<RoomTable> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.findAll()
  return RoomTable.new(models)
}

/* istanbul ignore next */
export async function newExitTable(): Promise<ExitTable> {
  const exitRepository = await getExitRepository()
  const models = await exitRepository.findAll()
  return new ExitTable(models)
}

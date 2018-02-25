import { ModelHydrator } from "./../db/model"
import { allDirections, Direction } from "./constants"
import { Exit } from "./exit"
import { Room } from "./room"

function filterOutNulls(direction) {
  return direction !== null
}

function getExitOrNull(node, direction): Exit | null {
  return node[direction] ? new Exit(node[direction], direction) : null
}

function createExitsFromData(data): Exit[] {
  return allDirections.map((direction) => getExitOrNull(data, direction)).filter(filterOutNulls)
}

export class RoomHydrator implements ModelHydrator {
  public hydrate(data): Room {
    return new Room(data.name, data.brief, data.description, createExitsFromData(data))
  }
}

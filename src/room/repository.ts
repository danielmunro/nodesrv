import { findNode } from "./../db/db"
import { allDirections, Direction } from "./constants"
import { Exit } from "./exit"
import { Room } from "./room"

function filterOutNulls(direction) {
  return direction !== null
}

function getExitOrNull(node, direction): Exit | null {
  return node[direction] ? new Exit(node[direction], direction) : null
}

function createExitsFromNode(node): Exit[] {
  return allDirections.map((direction) => getExitOrNull(node, direction)).filter(filterOutNulls)
}

export function findRoom(roomName: string): Promise<any> {
  return findNode(roomName)
          .then((node) => new Room(node.name, node.brief, node.description, createExitsFromNode(node)))
}

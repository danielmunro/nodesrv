import { findNode } from "./../db/db"
import { allDirections, Direction } from "./constants"
import { Exit } from "./exit"
import { Room } from "./room"

export function findRoom(roomName: string): Promise<any> {
  return findNode(roomName).then(
    (node) => new Room(node.name, node.brief, node.description, allDirections.map(
        (direction) => node[direction] ? new Exit(node[direction], direction) : null,
      ).filter((direction) => direction !== null)))
}

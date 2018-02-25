import { findNode } from "./../db/db"
import { RoomHydrator } from "./roomHydrator"

export function findRoom(roomName: string): Promise<any> {
  return findNode(roomName)
          .then((node) => new RoomHydrator().hydrate(node))
}

import { findNode } from "./../db/db"
import { RoomHydrator } from "./roomHydrator"

export function findRoom(identifier: string): Promise<any> {
  return findNode({ identifier })
          .then((node) => new RoomHydrator().hydrate(node))
}

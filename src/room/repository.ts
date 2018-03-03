import { findNode } from "./../db/db"
import { RoomHydrator } from "./roomHydrator"

// export function find(identifier: string): Promise<any> {
//   query("START room = node({id}) MATCH room - [direction] WHERE room")
// }

export function findRoom(identifier: string): Promise<any> {
  return findNode({ identifier })
          .then((node) => new RoomHydrator().hydrate(node))
}

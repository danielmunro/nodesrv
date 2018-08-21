import { getConnection } from "../../db/connection"
import { Room } from "../model/room"

export default interface RoomRepository {
  save(model)
  find(options)
}

export async function getRoomRepository(): Promise<RoomRepository> {
  return getConnection().then((connection) => connection.getRepository(Room))
}

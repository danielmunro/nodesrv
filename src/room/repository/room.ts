import { getConnection } from "../../db/connection"
import { Room } from "../model/room"
import RoomRepositoryImpl from "./roomImpl"

export default interface RoomRepository {
  save(model)
  findAll()
}

export async function getRoomRepository(): Promise<RoomRepository> {
  return getConnection().then((connection) => new RoomRepositoryImpl(connection.getRepository(Room)))
}

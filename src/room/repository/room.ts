import { getConnection } from "../../support/db/connection"
import { Room } from "../model/room"
import RoomRepositoryImpl from "./roomImpl"

export default interface RoomRepository {
  save(model: Room): Promise<Room>
  findAll(): Promise<Room[]>
}

export async function getRoomRepository(): Promise<RoomRepository> {
  const connection = await getConnection()

  return new RoomRepositoryImpl(connection.getRepository(Room))
}

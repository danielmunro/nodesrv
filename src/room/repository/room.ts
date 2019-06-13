import { getConnection } from "../../support/db/connection"
import { RoomEntity } from "../entity/roomEntity"
import RoomRepositoryImpl from "./roomImpl"

export default interface RoomRepository {
  save(model: RoomEntity): Promise<RoomEntity>
  findAll(): Promise<RoomEntity[]>
}

export async function getRoomRepository(): Promise<RoomRepository> {
  const connection = await getConnection()

  return new RoomRepositoryImpl(connection.getRepository(RoomEntity))
}

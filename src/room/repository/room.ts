import { getConnection } from "../../support/db/connection"
import { Room } from "../model/room"
import RoomRepositoryImpl from "./roomImpl"

export default interface RoomRepository {
  save(model)
  findAll()
  findOneByImportId(importId)
  findOneById(id)
}

export async function getRoomRepository(): Promise<RoomRepository> {
  const connection = await getConnection()

  return new RoomRepositoryImpl(connection.getRepository(Room))
}

import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Room } from "../model/room"

export async function getRoomRepository(): Promise<Repository<Room>> {
  return getConnection().then((connection) => connection.getRepository(Room))
}

export async function findOneRoom(id: number): Promise<Room> {
  return await getRoomRepository().then(
    (roomRepository) => roomRepository.findOneById(id, {relations: ["mobs"]}))
}

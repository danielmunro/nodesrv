import { getConnection } from "./../db/connection"
import { Exit } from "./model/exit"
import { Room } from "./model/room"

export async function findRoom(id: number): Promise<Room> {
  return await getConnection().then((connection) => connection.getRepository(Room).findOneById(id))
}

export async function findExit(id: number): Promise<Exit> {
  return await getConnection().then((connection) =>
    connection.getRepository(Exit).findOneById(id, {relations: ["source", "destination"]}))
}

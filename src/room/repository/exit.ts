import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Exit } from "../model/exit"

export async function getExitRepository(): Promise<Repository<Exit>> {
  return getConnection().then((connection) => connection.getRepository(Exit))
}

export async function findOneExit(id: number): Promise<Exit> {
  return await getExitRepository().then((exitRepository) =>
    exitRepository.findOneById(id, {relations: ["source", "destination"]}))
}

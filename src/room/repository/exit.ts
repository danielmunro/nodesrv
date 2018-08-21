import { getConnection } from "../../db/connection"
import { Exit } from "../model/exit"
import ExitRepositoryImpl from "./impl"

export default interface ExitRepository {
  save(model)
  findOneById(id)
}

export async function getExitRepository(): Promise<ExitRepository> {
  return getConnection().then((connection) => new ExitRepositoryImpl(connection.getRepository(Exit)))
}

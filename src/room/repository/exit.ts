import { getConnection } from "../../support/db/connection"
import { Exit } from "../model/exit"
import ExitRepositoryImpl from "./exitImpl"

export default interface ExitRepository {
  save(model)
  findOneById(id)
  findAll()
}

export async function getExitRepository(): Promise<ExitRepository> {
  return getConnection().then((connection) => new ExitRepositoryImpl(connection.getRepository(Exit)))
}

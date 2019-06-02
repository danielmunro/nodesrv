import { getConnection } from "../../support/db/connection"
import { Exit } from "../model/exit"
import ExitRepositoryImpl from "./exitImpl"

export default interface ExitRepository {
  save(model: Exit): Promise<Exit>
  findOneById(id: number): Promise<Exit | undefined>
  findAll(): Promise<Exit[]>
}

export async function getExitRepository(): Promise<ExitRepository> {
  const connection = await getConnection()
  return new ExitRepositoryImpl(connection.getRepository(Exit))
}

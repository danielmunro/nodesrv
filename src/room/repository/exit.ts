import { getConnection } from "../../support/db/connection"
import { ExitEntity } from "../entity/exitEntity"
import ExitRepositoryImpl from "./exitImpl"

export default interface ExitRepository {
  save(model: ExitEntity): Promise<ExitEntity>
  findOneById(id: number): Promise<ExitEntity | undefined>
  findAll(): Promise<ExitEntity[]>
}

export async function getExitRepository(): Promise<ExitRepository> {
  const connection = await getConnection()
  return new ExitRepositoryImpl(connection.getRepository(ExitEntity))
}

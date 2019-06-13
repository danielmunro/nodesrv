import { getConnection } from "../../support/db/connection"
import MobResetEntity from "../entity/mobResetEntity"
import MobResetRepositoryImpl from "./mobResetRepositoryImpl"

export default interface MobResetRepository {
  findAll(): Promise<MobResetEntity[]>
  save(mobReset: MobResetEntity): Promise<MobResetEntity>
}

export async function getMobResetRepository(): Promise<MobResetRepository> {
  return await getConnection().then((connection) =>
    new MobResetRepositoryImpl(connection.getRepository(MobResetEntity)))
}

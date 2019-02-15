import { getConnection } from "../../support/db/connection"
import MobReset from "../model/mobReset"
import MobResetRepositoryImpl from "./mobResetRepositoryImpl"

export default interface MobResetRepository {
  findAll(): Promise<MobReset[]>
  save(mobReset: MobReset): Promise<MobReset>
}

export async function getMobResetRepository(): Promise<MobResetRepository> {
  return await getConnection().then((connection) =>
    new MobResetRepositoryImpl(connection.getRepository(MobReset)))
}

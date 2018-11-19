import { getConnection } from "../../db/connection"
import MobReset from "../model/mobReset"
import MobResetRepositoryImpl from "./mobResetRepositoryImpl"

export default interface MobResetRepository {
  findAll(): Promise<MobReset[]>
  save(mobReset)
}

export async function getMobResetRepository(): Promise<MobResetRepository> {
  return await getConnection().then((connection) =>
    new MobResetRepositoryImpl(connection.getRepository(MobReset)))
}

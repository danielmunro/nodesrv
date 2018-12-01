import { getConnection } from "../../support/db/connection"
import { MobEquipReset } from "../model/mobEquipReset"
import MobEquipResetRepositoryImpl from "./mobEquipResetRepositoryImpl"

export default interface MobEquipResetRepository {
  findAll()
  save(mobEquipReset)
}

export async function getMobEquipResetRepository(): Promise<MobEquipResetRepository> {
  const connection = await getConnection()
  return new MobEquipResetRepositoryImpl(connection.getRepository(MobEquipReset))
}

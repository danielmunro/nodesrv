import { getConnection } from "../../support/db/connection"
import { MobEquipResetEntity } from "../entity/mobEquipResetEntity"
import MobEquipResetRepositoryImpl from "./mobEquipResetRepositoryImpl"

export default interface MobEquipResetRepository {
  findAll(): any
  save(mobEquipReset: any): any
}

export async function getMobEquipResetRepository(): Promise<MobEquipResetRepository> {
  const connection = await getConnection()
  return new MobEquipResetRepositoryImpl(connection.getRepository(MobEquipResetEntity))
}

import { getConnection } from "../../support/db/connection"
import { Mob } from "../model/mob"
import MobRepositoryImpl from "./impl"

export default interface MobRepository {
  findAll(): Promise<Mob[]>
  findOne(uuid: string): Promise<Mob>
  findOneById(id): Promise<Mob>
  findOneByImportId(importId)
  save(mob)
}

export async function getMobRepository(): Promise<MobRepository> {
  return await getConnection().then((connection) =>
    new MobRepositoryImpl(connection.getRepository(Mob)))
}

export async function persistMob(mob) {
  return await getMobRepository().then((mobRepository) => mobRepository.save(mob))
}

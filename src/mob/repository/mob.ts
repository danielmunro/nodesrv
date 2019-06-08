import { getConnection } from "../../support/db/connection"
import { Mob } from "../model/mob"
import MobRepositoryImpl from "./impl"

export default interface MobRepository {
  findAll(): Promise<Mob[]>
  findOne(uuid: string): Promise<Mob | undefined>
  findOneByName(name: string): Promise<Mob | undefined>
  save(mob: Mob | Mob[]): Promise<Mob | Mob[]>
}

export async function getMobRepository(): Promise<MobRepository> {
  return await getConnection().then((connection) =>
    new MobRepositoryImpl(connection.getRepository(Mob)))
}

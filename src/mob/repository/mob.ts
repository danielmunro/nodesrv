import { getConnection } from "../../support/db/connection"
import { MobEntity } from "../entity/mobEntity"
import MobRepositoryImpl from "./impl"

export default interface MobRepository {
  findAll(): Promise<MobEntity[]>
  findOne(uuid: string): Promise<MobEntity | undefined>
  findOneByName(name: string): Promise<MobEntity | undefined>
  save(mob: MobEntity | MobEntity[]): Promise<any>
}

export async function getMobRepository(): Promise<MobRepository> {
  return await getConnection().then((connection) =>
    new MobRepositoryImpl(connection.getRepository(MobEntity)))
}

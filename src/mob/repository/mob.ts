import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Mob } from "../model/mob"

export async function getMobRepository(): Promise<Repository<Mob>> {
  return getConnection().then((connection) => connection.getRepository(Mob))
}

export async function findOneMob(id: number): Promise<Mob> {
  return await getMobRepository().then(
    (mobRepository) => mobRepository.findOneById(id))
}

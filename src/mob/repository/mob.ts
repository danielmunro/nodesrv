import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Mob } from "../model/mob"

async function getMobRepository(): Promise<Repository<Mob>> {
  return getConnection().then((connection) => connection.getRepository(Mob))
}

export async function findOneMob(id: number): Promise<Mob> {
  return await getMobRepository().then(
    (mobRepository) => mobRepository.findOneById(id))
}

export async function findWanderingMobs(): Promise<Mob[]> {
  return await getMobRepository()
    .then((mobRepository) => mobRepository.find({ relations: ["room"], where: { wanders: true }}))
}

export async function saveMobRoom(mob: Mob) {
  return await getMobRepository()
    .then((repository) =>
      repository.createQueryBuilder()
      .update(Mob)
      .set({ room: mob.room })
      .where("id = :id", { id: mob.id })
      .execute())
}

import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Mob } from "../model/mob"

export async function getMobRepository(): Promise<Repository<Mob>> {
  return await getConnection().then((connection) => connection.getRepository(Mob))
}

export async function findOneMob(id: number): Promise<Mob> {
  return await getMobRepository().then((mobRepository) => mobRepository.findOneById(id))
}

export async function findPlayerMobByName(name: string): Promise<Mob> {
  return await getMobRepository().then((mobRepository) => mobRepository.findOne({ name, isPlayer: true }))
}

export async function findWanderingMobs(): Promise<Mob[]> {
  return await getMobRepository()
    .then((mobRepository) => mobRepository.find({ where: { wanders: true, isPlayer: false }}))
}

export async function persistMob(mob: Mob) {
  return await getMobRepository().then((mobRepository) => mobRepository.save(mob))
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

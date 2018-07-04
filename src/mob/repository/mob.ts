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

// @todo handle paginated wandering mobs in app
export async function findWanderingMobs(take: number = 10, skip: number = 0): Promise<Mob[]> {
  return await getMobRepository()
    .then((mobRepository) =>
      mobRepository.find({ where: { wanders: true, isPlayer: false }, take, skip, order: {id: "DESC"}}))
}

export async function persistMob(mob) {
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

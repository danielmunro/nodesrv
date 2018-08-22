import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Affect } from "../model/affect"

async function getAffectRepository(): Promise<Repository<Affect>> {
  return await getConnection().then((connection) => connection.getRepository(Affect))
}

export async function decrementAffects(table) {
  return await getAffectRepository()
    .then((repository) =>
      repository.createQueryBuilder()
      .update(Affect)
      .set({ timeout: () => "timeout - 1" })
      .returning("timeout")
      .execute())
}

export async function pruneTimedOutAffects() {
  return await getAffectRepository()
    .then((repository) =>
      repository.createQueryBuilder()
      .delete()
      .from(Affect)
      .where("timeout < :timeout", { timeout: 0})
      .execute())
}

import "reflect-metadata"
import { getConnection } from "../../support/db/connection"
import { PlayerEntity } from "../entity/playerEntity"
import PlayerRepositoryImpl from "./impl"

export default interface PlayerRepository {
  findOneByEmail(email: string): Promise<PlayerEntity>
  save(player: PlayerEntity | PlayerEntity[]): Promise<any>
}

export async function getPlayerRepository(): Promise<PlayerRepository> {
  const connection = await getConnection()
  return new PlayerRepositoryImpl(connection.getRepository(PlayerEntity))
}

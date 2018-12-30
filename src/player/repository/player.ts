import { getConnection } from "../../support/db/connection"
import { Player } from "../model/player"
import PlayerRepositoryImpl from "./impl"

export default interface PlayerRepository {
  findOneByEmail(email: string): Promise<Player>
  save(player: Player | Player[])
}

export async function getPlayerRepository(): Promise<PlayerRepository> {
  const connection = await getConnection()
  return new PlayerRepositoryImpl(connection.getRepository(Player))
}

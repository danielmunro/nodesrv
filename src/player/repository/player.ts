import { getConnection } from "../../db/connection"
import { Player } from "../model/player"
import PlayerRepositoryImpl from "./impl"

export default interface PlayerRepository {
  findOneByEmail(email: string): Promise<Player>
  save(player: Player)
}

export async function getPlayerRepository(): Promise<PlayerRepository> {
  return getConnection().then((connection) => new PlayerRepositoryImpl(connection.getRepository(Player)))
}

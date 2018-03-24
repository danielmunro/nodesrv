import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Player } from "../model/player"

export async function getPlayerRepository(): Promise<Repository<Player>> {
  return getConnection().then((connection) => connection.getRepository(Player))
}

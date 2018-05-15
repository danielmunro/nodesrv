import { Player } from "./model/player"
import { getPlayerRepository } from "./repository/player"

export async function savePlayer(player: Player): Promise<Player> {
  const playerRepository = await getPlayerRepository()

  return playerRepository.save(player)
}

import { Player } from "../../player/model/player"
import PlayerRepository from "../../player/repository/player"

export default class AuthService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  public getOnePlayer(email: string): Promise<Player> {
    return this.playerRepository.findOneByEmail(email)
  }
}

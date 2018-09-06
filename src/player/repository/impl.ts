import { Repository } from "typeorm"
import { Player } from "../model/player"
import PlayerRepository from "./player"

export default class PlayerRepositoryImpl implements PlayerRepository {
  constructor(private readonly playerRepository: Repository<Player>) {}

  public async findOneByEmail(email: string): Promise<Player> {
    return this.playerRepository.findOne({ where: { email }})
  }

  public save(player: Player) {
    return this.playerRepository.save(player)
  }
}

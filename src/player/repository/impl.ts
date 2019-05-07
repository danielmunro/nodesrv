import {injectable} from "inversify"
import { Repository } from "typeorm"
import { Player } from "../model/player"
import PlayerRepository from "./player"

@injectable()
export default class PlayerRepositoryImpl implements PlayerRepository {
  constructor(private readonly playerRepository: Repository<Player>) {}

  public async findOneByEmail(email: string): Promise<Player> {
    return this.playerRepository.findOne({ where: { email }})
  }

  public save(player: Player) {
    return this.playerRepository.save(player)
  }
}

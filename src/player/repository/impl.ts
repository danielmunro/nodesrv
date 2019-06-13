import {injectable} from "inversify"
import { Repository } from "typeorm"
import { PlayerEntity } from "../entity/playerEntity"
import PlayerRepository from "./player"

@injectable()
export default class PlayerRepositoryImpl implements PlayerRepository {
  constructor(private readonly playerRepository: Repository<PlayerEntity>) {}

  public async findOneByEmail(email: string): Promise<PlayerEntity> {
    return this.playerRepository.findOne({ where: { email }})
  }

  public save(player: PlayerEntity) {
    return this.playerRepository.save(player)
  }
}

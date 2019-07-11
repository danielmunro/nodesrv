import {injectable} from "inversify"
import { Repository } from "typeorm"
import {MobEntity} from "../../mob/entity/mobEntity"
import { PlayerEntity } from "../entity/playerEntity"
import PlayerRepository from "./player"

@injectable()
export default class PlayerRepositoryImpl implements PlayerRepository {
  constructor(private readonly playerRepository: Repository<PlayerEntity>) {}

  public async findOneByEmail(email: string): Promise<PlayerEntity | undefined> {
    return this.playerRepository.findOne({ email })
  }

  public async findOneByMob(mobEntity: MobEntity): Promise<PlayerEntity | undefined> {
    return this.playerRepository.createQueryBuilder("player")
      .leftJoinAndSelect("player.mobs", "mob")
      .where("mob.id = :id", { id: mobEntity.id })
      .getOne()
  }

  public save(player: PlayerEntity) {
    return this.playerRepository.save(player)
  }
}

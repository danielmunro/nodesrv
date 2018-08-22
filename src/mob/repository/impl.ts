import MobRepository from "./mob"
import { Repository } from "typeorm"
import { Mob } from "../model/mob"

export default class MobRepositoryImpl implements MobRepository {
  constructor(private readonly mobRepository: Repository<Mob>) {}

  public async findAll(): Promise<Mob[]> {
    return this.mobRepository.find({ relations: ["room", "playerMob"] })
  }

  public async findOne(uuid: string): Promise<Mob> {
    return this.mobRepository.findOne({ uuid })
  }

  public async save(mob: Mob) {
    return this.mobRepository.save(mob)
  }
}

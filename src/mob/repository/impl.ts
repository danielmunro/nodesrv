import { Repository } from "typeorm"
import { Mob } from "../model/mob"
import MobRepository from "./mob"

export default class MobRepositoryImpl implements MobRepository {
  constructor(private readonly mobRepository: Repository<Mob>) {}

  public async findAll(): Promise<Mob[]> {
    return this.mobRepository.find({ relations: ["player"] })
  }

  public async findOne(uuid: string): Promise<Mob> {
    return this.mobRepository.findOne({ uuid })
  }

  public async findOneById(id) {
    return this.mobRepository.findOneById(id)
  }

  public async findOneByImportId(importId) {
    return this.mobRepository.findOne({ importId })
  }

  public async save(mob: Mob) {
    return this.mobRepository.save(mob)
  }
}

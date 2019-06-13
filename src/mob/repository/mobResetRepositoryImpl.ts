import { Repository } from "typeorm"
import MobResetEntity from "../entity/mobResetEntity"
import MobResetRepository from "./mobReset"

export default class MobResetRepositoryImpl implements MobResetRepository {
  constructor(private readonly mobResetRepository: Repository<MobResetEntity>) {}

  public findAll(): Promise<MobResetEntity[]> {
      return this.mobResetRepository.find()
  }

  public save(mobReset: MobResetEntity) {
    return this.mobResetRepository.save(mobReset)
  }
}

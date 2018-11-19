import { Repository } from "typeorm"
import MobReset from "../model/mobReset"
import MobResetRepository from "./mobReset"

export default class MobResetRepositoryImpl implements MobResetRepository {
  constructor(private readonly mobResetRepository: Repository<MobReset>) {}

  public findAll(): Promise<MobReset[]> {
      return this.mobResetRepository.find()
  }

  public save(mobReset) {
    return this.mobResetRepository.save(mobReset)
  }
}

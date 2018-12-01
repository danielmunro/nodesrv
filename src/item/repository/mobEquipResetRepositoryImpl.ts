import { Repository } from "typeorm"
import MobEquipResetRepository from "./mobEquipReset"
import { MobEquipReset } from "../model/mobEquipReset"

export default class MobEquipResetRepositoryImpl implements MobEquipResetRepository {
  constructor(private readonly mobEquipResetRepository: Repository<MobEquipReset>) {}

  public async findAll() {
    return this.mobEquipResetRepository.find()
  }

  public async save(mobEquipReset: MobEquipReset) {
    await this.mobEquipResetRepository.save(mobEquipReset)
  }
}

import { Repository } from "typeorm"
import { MobEquipResetEntity } from "../entity/mobEquipResetEntity"
import MobEquipResetRepository from "./mobEquipReset"

export default class MobEquipResetRepositoryImpl implements MobEquipResetRepository {
  constructor(private readonly mobEquipResetRepository: Repository<MobEquipResetEntity>) {}

  public async findAll() {
    return this.mobEquipResetRepository.find()
  }

  public async save(mobEquipReset: MobEquipResetEntity) {
    await this.mobEquipResetRepository.save(mobEquipReset)
  }
}

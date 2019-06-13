import { Repository } from "typeorm"
import ItemMobResetEntity from "../entity/itemMobResetEntity"
import ItemResetRepository from "./itemReset"

export default class ItemMobResetRepositoryImpl implements ItemResetRepository {
  constructor(private readonly itemMobResetRepository: Repository<ItemMobResetEntity>) {}

  public findAll(): Promise<ItemMobResetEntity[]> {
    return this.itemMobResetRepository.find()
  }

  public save(itemReset: ItemMobResetEntity) {
    return this.itemMobResetRepository.save(itemReset)
  }
}

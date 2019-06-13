import { Repository } from "typeorm"
import ItemResetEntity from "../entity/itemResetEntity"
import ItemResetRepository from "./itemReset"

export default class ItemResetRepositoryImpl implements ItemResetRepository {
  constructor(private readonly itemResetRepository: Repository<ItemResetEntity>) {}

  public findAll(): Promise<ItemResetEntity[]> {
    return this.itemResetRepository.find()
  }

  public save(itemReset) {
    return this.itemResetRepository.save(itemReset)
  }
}

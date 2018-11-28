import { Repository } from "typeorm"
import ItemResetRepository from "./itemReset"
import ItemMobReset from "../model/itemMobReset"

export default class ItemMobResetRepositoryImpl implements ItemResetRepository {
  constructor(private readonly itemMobResetRepository: Repository<ItemMobReset>) {}

  public findAll(): Promise<ItemMobReset[]> {
    return this.itemMobResetRepository.find()
  }

  public save(itemReset: ItemMobReset) {
    return this.itemMobResetRepository.save(itemReset)
  }
}

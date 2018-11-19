import { Repository } from "typeorm"
import ItemReset from "../model/itemReset"
import ItemResetRepository from "./itemReset"

export default class ItemResetRepositoryImpl implements ItemResetRepository {
  constructor(private readonly itemResetRepository: Repository<ItemReset>) {}

  public findAll(): Promise<ItemReset[]> {
    return this.itemResetRepository.find()
  }

  public save(itemReset) {
    return this.itemResetRepository.save(itemReset)
  }
}

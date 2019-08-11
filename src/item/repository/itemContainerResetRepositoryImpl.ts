import { Repository } from "typeorm"
import { ItemContainerResetEntity } from "../entity/itemContainerResetEntity"
import ItemContainerResetRepository from "./itemContainerReset"

export default class ItemContainerResetRepositoryImpl implements ItemContainerResetRepository {
  constructor(private readonly itemContainerResetRepository: Repository<ItemContainerResetEntity>) {}

  public findAll(): Promise<ItemContainerResetEntity[]> {
    return this.itemContainerResetRepository.find()
  }

  public save(itemContainerReset: any) {
    return this.itemContainerResetRepository.save(itemContainerReset)
  }
}

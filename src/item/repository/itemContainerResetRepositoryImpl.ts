import { Repository } from "typeorm"
import { ItemContainerReset } from "../model/itemContainerReset"
import ItemContainerResetRepository from "./itemContainerReset"

export default class ItemContainerResetRepositoryImpl implements ItemContainerResetRepository {
  constructor(private readonly itemContainerResetRepository: Repository<ItemContainerReset>) {}

  public findAll(): Promise<ItemContainerReset[]> {
    return this.itemContainerResetRepository.find()
  }

  public save(itemContainerReset) {
    return this.itemContainerResetRepository.save(itemContainerReset)
  }
}

import { Repository } from "typeorm"
import { ItemEntity } from "../entity/itemEntity"
import ItemRepository from "./item"

export default class ItemRepositoryImpl implements ItemRepository {
  constructor(private readonly itemRepository: Repository<ItemEntity>) {}

  public findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.find()
  }

  public save(item) {
    return this.itemRepository.save(item)
  }
}

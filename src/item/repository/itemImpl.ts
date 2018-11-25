import { Repository } from "typeorm"
import { Item } from "../model/item"
import ItemRepository from "./item"

export default class ItemRepositoryImpl implements ItemRepository {
  constructor(private readonly itemRepository: Repository<Item>) {}

  public findAll(): Promise<Item[]> {
    return this.itemRepository.find()
  }

  public save(item) {
    return this.itemRepository.save(item)
  }

  public findOneByImportId(importId): Promise<Item> {
    return this.itemRepository.findOne({ importId })
  }

  public findOneById(id): Promise<Item> {
    return this.itemRepository.findOneById(id)
  }
}

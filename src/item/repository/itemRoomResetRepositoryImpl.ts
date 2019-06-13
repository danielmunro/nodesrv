import { Repository } from "typeorm"
import { ItemRoomResetEntity } from "../entity/itemRoomResetEntity"
import ItemRoomResetRepository from "./itemRoomReset"

export default class ItemRoomResetRepositoryImpl implements ItemRoomResetRepository {
  constructor(private readonly itemRoomResetRepository: Repository<ItemRoomResetEntity>) {}

  public async findAll() {
    return this.itemRoomResetRepository.find()
  }

  public async save(itemRoomReset: ItemRoomResetEntity) {
    await this.itemRoomResetRepository.save(itemRoomReset)
  }
}

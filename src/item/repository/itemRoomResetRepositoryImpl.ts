import { Repository } from "typeorm"
import { ItemRoomReset } from "../model/itemRoomReset"
import ItemRoomResetRepository from "./itemRoomReset"

export default class ItemRoomResetRepositoryImpl implements ItemRoomResetRepository {
  constructor(private readonly itemRoomResetRepository: Repository<ItemRoomReset>) {}

  public async findAll() {
    return this.itemRoomResetRepository.find()
  }

  public async save(itemRoomReset: ItemRoomReset) {
    await this.itemRoomResetRepository.save(itemRoomReset)
  }
}

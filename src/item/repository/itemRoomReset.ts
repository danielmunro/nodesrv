import { getConnection } from "../../support/db/connection"
import { ItemRoomResetEntity } from "../entity/itemRoomResetEntity"
import ItemRoomResetRepositoryImpl from "./itemRoomResetRepositoryImpl"

export default interface ItemRoomResetRepository {
  findAll(): any
  save(itemRoomReset: any): any
}

export async function getItemRoomResetRepository(): Promise<ItemRoomResetRepository> {
  const connection = await getConnection()
  return new ItemRoomResetRepositoryImpl(connection.getRepository(ItemRoomResetEntity))
}

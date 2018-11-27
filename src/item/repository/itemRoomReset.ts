import { getConnection } from "../../support/db/connection"
import { ItemRoomReset } from "../model/itemRoomReset"
import ItemRoomResetRepositoryImpl from "./itemRoomResetRepositoryImpl"

export default interface ItemRoomResetRepository {
  findAll()
  save(itemRoomReset)
}

export async function getItemRoomResetRepository(): Promise<ItemRoomResetRepository> {
  const connection = await getConnection()
  return new ItemRoomResetRepositoryImpl(connection.getRepository(ItemRoomReset))
}

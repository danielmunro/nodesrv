import { getConnection } from "../../db/connection"
import ItemReset from "../model/itemReset"
import ItemResetRepositoryImpl from "./itemResetRepositoryImpl"

export default interface ItemResetRepository {
  findAll(): Promise<ItemReset[]>
  save(itemReset)
}

export async function getItemResetRepository(): Promise<ItemResetRepository> {
  const connection = await getConnection()
  return new ItemResetRepositoryImpl(connection.getRepository(ItemReset))
}

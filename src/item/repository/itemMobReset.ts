import { getConnection } from "../../support/db/connection"
import ItemMobReset from "../model/itemMobReset"
import ItemMobResetRepositoryImpl from "./itemMobResetRepositoryImpl"

export default interface ItemMobResetRepository {
  findAll(): Promise<ItemMobReset[]>
  save(itemMobReset: ItemMobReset)
}

export async function getItemMobResetRepository(): Promise<ItemMobResetRepository> {
  const connection = await getConnection()
  return new ItemMobResetRepositoryImpl(connection.getRepository(ItemMobReset))
}

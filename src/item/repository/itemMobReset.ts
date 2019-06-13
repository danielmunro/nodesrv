import { getConnection } from "../../support/db/connection"
import ItemMobResetEntity from "../entity/itemMobResetEntity"
import ItemMobResetRepositoryImpl from "./itemMobResetRepositoryImpl"

export default interface ItemMobResetRepository {
  findAll(): Promise<ItemMobResetEntity[]>
  save(itemMobReset: ItemMobResetEntity)
}

export async function getItemMobResetRepository(): Promise<ItemMobResetRepository> {
  const connection = await getConnection()
  return new ItemMobResetRepositoryImpl(connection.getRepository(ItemMobResetEntity))
}

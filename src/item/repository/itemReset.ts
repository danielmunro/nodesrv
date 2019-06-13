import { getConnection } from "../../support/db/connection"
import ItemResetEntity from "../entity/itemResetEntity"
import ItemResetRepositoryImpl from "./itemResetRepositoryImpl"

export default interface ItemResetRepository {
  findAll(): Promise<ItemResetEntity[]>
  save(itemReset)
}

export async function getItemResetRepository(): Promise<ItemResetRepository> {
  const connection = await getConnection()
  return new ItemResetRepositoryImpl(connection.getRepository(ItemResetEntity))
}

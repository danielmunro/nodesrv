import { getConnection } from "../../support/db/connection"
import { ItemEntity } from "../entity/itemEntity"
import ItemRepositoryImpl from "./itemImpl"

export default interface ItemRepository {
  findAll(): Promise<ItemEntity[]>
  save(item: any): any
}

export async function getItemRepository(): Promise<ItemRepository> {
  const connection = await getConnection()
  return new ItemRepositoryImpl(connection.getRepository(ItemEntity))
}

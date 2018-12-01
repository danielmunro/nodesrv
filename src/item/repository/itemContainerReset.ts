import { getConnection } from "../../support/db/connection"
import { ItemContainerReset } from "../model/itemContainerReset"
import ItemContainerResetRepositoryImpl from "./itemContainerResetRepositoryImpl"

export default interface ItemContainerResetRepository {
  findAll(): Promise<ItemContainerReset[]>
  save(itemContainerReset)
}

export async function getItemContainerResetRepository(): Promise<ItemContainerResetRepository> {
  const connection = await getConnection()
  return new ItemContainerResetRepositoryImpl(connection.getRepository(ItemContainerReset))
}

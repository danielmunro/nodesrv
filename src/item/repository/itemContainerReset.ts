import { getConnection } from "../../support/db/connection"
import { ItemContainerResetEntity } from "../entity/itemContainerResetEntity"
import ItemContainerResetRepositoryImpl from "./itemContainerResetRepositoryImpl"

export default interface ItemContainerResetRepository {
  findAll(): Promise<ItemContainerResetEntity[]>
  save(itemContainerReset)
}

export async function getItemContainerResetRepository(): Promise<ItemContainerResetRepository> {
  const connection = await getConnection()
  return new ItemContainerResetRepositoryImpl(connection.getRepository(ItemContainerResetEntity))
}

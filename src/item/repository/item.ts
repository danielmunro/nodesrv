import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Item } from "../model/item"

export async function getItemRepository(): Promise<Repository<Item>> {
  return await getConnection().then((connection) => connection.getRepository(Item))
}

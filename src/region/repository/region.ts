import { Repository } from "typeorm"
import { getConnection } from "../../support/db/connection"
import { Region } from "../model/region"

export async function getRegionRepository(): Promise<Repository<Region>> {
  return await getConnection().then((connection) => connection.getRepository(Region))
}

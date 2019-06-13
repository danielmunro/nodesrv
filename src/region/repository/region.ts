import { Repository } from "typeorm"
import { getConnection } from "../../support/db/connection"
import { RegionEntity } from "../entity/regionEntity"

export async function getRegionRepository(): Promise<Repository<RegionEntity>> {
  return await getConnection().then((connection) => connection.getRepository(RegionEntity))
}

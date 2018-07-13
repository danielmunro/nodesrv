import { Repository } from "typeorm"
import { getConnection } from "../../db/connection"
import { Region } from "../model/region"

export async function getRegionRepository(): Promise<Repository<Region>> {
  return await getConnection().then((connection) => connection.getRepository(Region))
}

export async function persistRegion(region) {
  return await getRegionRepository().then((regionRepository) => regionRepository.save(region))
}

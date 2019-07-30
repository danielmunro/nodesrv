import {Repository} from "typeorm"
import {getConnection} from "../../support/db/connection"
import {RealEstateListingEntity} from "../entity/realEstateListingEntity"

export async function createRealEstateListingRepository(): Promise<RealEstateListingRepository> {
  return (await getConnection()).getRepository(RealEstateListingEntity)
}

export default class RealEstateListingRepository extends Repository<RealEstateListingEntity> {}

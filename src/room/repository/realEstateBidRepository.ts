import {Repository} from "typeorm"
import {getConnection} from "../../support/db/connection"
import {RealEstateBidEntity} from "../entity/realEstateBidEntity"

export async function createRealEstateBidRepository(): Promise<RealEstateBidRepository> {
  return (await getConnection()).getRepository(RealEstateBidEntity)
}

export default class RealEstateBidRepository extends Repository<RealEstateBidEntity> {}

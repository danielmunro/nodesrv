import {inject, injectable} from "inversify"
import {Types} from "../../support/types"
import {RealEstateListingEntity} from "../entity/realEstateListingEntity"
import {RoomEntity} from "../entity/roomEntity"
import RealEstateListingRepository from "../repository/realEstateListingRepository"
import RealEstateListingTable from "../table/realEstateListingTable"

@injectable()
export default class RealEstateService {
  constructor(
    @inject(Types.RealEstateListingRepository)
    private readonly realEstateListingRepository: RealEstateListingRepository,
    @inject(Types.RealEstateListingTable) private readonly realEstateListingTable: RealEstateListingTable) {}

  public getListing(room: RoomEntity): RealEstateListingEntity | undefined {
    return this.realEstateListingTable.getRealEstateFromRoom(room)
  }

  public async createListing(realEstateListingEntity: RealEstateListingEntity) {
    this.realEstateListingTable.addRealEstateListing(realEstateListingEntity)
    await this.realEstateListingRepository.save(realEstateListingEntity)
  }
}

import {inject, injectable} from "inversify"
import {Types} from "../../support/types"
import {RealEstateBidEntity} from "../entity/realEstateBidEntity"
import {RealEstateListingEntity} from "../entity/realEstateListingEntity"
import {RoomEntity} from "../entity/roomEntity"
import RealEstateBidRepository from "../repository/realEstateBidRepository"
import RealEstateListingRepository from "../repository/realEstateListingRepository"
import RealEstateBidTable from "../table/realEstateBidTable"
import RealEstateListingTable from "../table/realEstateListingTable"

@injectable()
export default class RealEstateService {
  constructor(
    @inject(Types.RealEstateListingRepository)
    private readonly realEstateListingRepository: RealEstateListingRepository,
    @inject(Types.RealEstateListingTable) private readonly realEstateListingTable: RealEstateListingTable,
    @inject(Types.RealEstateBidRepository) private readonly realEstateBidRepository: RealEstateBidRepository,
    @inject(Types.RealEstateBidTable) private readonly realEstateBidTable: RealEstateBidTable) {}

  public getListing(room: RoomEntity): RealEstateListingEntity | undefined {
    return this.realEstateListingTable.getRealEstateFromRoom(room)
  }

  public async createListing(realEstateListingEntity: RealEstateListingEntity) {
    this.realEstateListingTable.addRealEstateListing(realEstateListingEntity)
    await this.realEstateListingRepository.save(realEstateListingEntity)
  }

  public async createBid(realEstateBidEntity: RealEstateBidEntity) {
    this.realEstateBidTable.addBid(realEstateBidEntity)
    await this.saveBid(realEstateBidEntity)
  }

  public async saveBid(realEstateBidEntity: RealEstateBidEntity) {
    await this.realEstateBidRepository.save(realEstateBidEntity)
  }

  public getBidsForRoom(room: RoomEntity): RealEstateBidEntity[] {
    return this.realEstateBidTable.getBidsForRoom(room)
  }
}

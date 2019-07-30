import {injectable} from "inversify"
import {RealEstateListingEntity} from "../entity/realEstateListingEntity"
import {RoomEntity} from "../entity/roomEntity"

@injectable()
export default class RealEstateListingTable {
  constructor(private readonly realEstateListings: RealEstateListingEntity[] = []) {}

  public getRealEstateFromRoom(room: RoomEntity): RealEstateListingEntity | undefined {
    return this.realEstateListings.find(listing => listing.room.uuid === room.uuid)
  }

  public addRealEstateListing(realEstateListingEntity: RealEstateListingEntity) {
    this.realEstateListings.push(realEstateListingEntity)
  }
}

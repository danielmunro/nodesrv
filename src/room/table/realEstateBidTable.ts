import {injectable} from "inversify"
import {RealEstateBidEntity} from "../entity/realEstateBidEntity"
import {RoomEntity} from "../entity/roomEntity"

@injectable()
export default class RealEstateBidTable {
  constructor(private readonly realEstateBids: RealEstateBidEntity[] = []) {}

  public getBidsForRoom(room: RoomEntity): RealEstateBidEntity[] {
    return this.realEstateBids.filter(bid => bid.listing.room.uuid === room.uuid)
  }

  public addBid(realEstateBidEntity: RealEstateBidEntity) {
    this.realEstateBids.push(realEstateBidEntity)
  }
}

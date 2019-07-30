import {injectable} from "inversify"
import {RealEstateBidEntity} from "../entity/realEstateBidEntity"
import {RoomEntity} from "../entity/roomEntity"

@injectable()
export default class RealEstateBidTable {
  constructor(private readonly realEstateBids: RealEstateBidEntity[] = []) {}

  public getBidFromRoom(room: RoomEntity): RealEstateBidEntity | undefined {
    return this.realEstateBids.find(bid => bid.listing.room.uuid === room.uuid)
  }

  public addBid(realEstateBidEntity: RealEstateBidEntity) {
    this.realEstateBids.push(realEstateBidEntity)
  }
}

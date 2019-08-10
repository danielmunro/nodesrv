import { inject, injectable } from "inversify"
import {Types} from "../../support/types"
import {RoomEntity} from "../entity/roomEntity"
import RoomRepository from "../repository/room"

@injectable()
export default class RoomService {
  constructor(@inject(Types.RoomRepository) private readonly roomRepository: RoomRepository) {}

  public async saveRoom(room: RoomEntity) {
    return this.roomRepository.save(room)
  }
}

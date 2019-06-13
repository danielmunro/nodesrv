import { Repository } from "typeorm"
import { RoomEntity } from "../entity/roomEntity"
import RoomRepository from "./room"

export default class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomRepository: Repository<RoomEntity>) {}

  public save(model: RoomEntity): Promise<RoomEntity> {
    return this.roomRepository.save(model)
  }

  public findAll(): Promise<RoomEntity[]> {
    return this.roomRepository.find()
  }
}

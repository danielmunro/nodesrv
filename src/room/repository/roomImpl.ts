import { Repository } from "typeorm"
import { Room } from "../model/room"
import RoomRepository from "./room"

export default class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomRepository: Repository<Room>) {}

  public save(model: Room): Promise<Room> {
    return this.roomRepository.save(model)
  }

  public findAll(): Promise<Room[]> {
    return this.roomRepository.find()
  }
}

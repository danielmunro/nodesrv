import { Repository } from "typeorm"
import { Room } from "../model/room"
import RoomRepository from "./room"

export default class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomRepository: Repository<Room>) {}

  public save(model) {
    return this.roomRepository.save(model)
  }

  public findAll() {
    return this.roomRepository.find()
  }

  public findOneById(id) {
    return this.roomRepository.findOneById(id)
  }

  public async findOneByImportId(importID) {
    return this.roomRepository.findOne({ importID })
  }
}

import { Repository } from "typeorm"
import { Exit } from "../model/exit"
import ExitRepository from "./exit"

export default class ExitRepositoryImpl implements ExitRepository {
  constructor(private readonly exitRepository: Repository<Exit>) {}

  public save(model: Exit): Promise<Exit> {
    return this.exitRepository.save(model)
  }

  public findOneById(id: number): Promise<Exit | undefined> {
    return this.exitRepository.findOne(id, { relations: ["source", "destination"] })
  }

  public findAll() {
    return this.exitRepository.find({ relations: [ "destination" ]})
  }
}

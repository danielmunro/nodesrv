import { Repository } from "typeorm"
import { ExitEntity } from "../entity/exitEntity"
import ExitRepository from "./exit"

export default class ExitRepositoryImpl implements ExitRepository {
  constructor(private readonly exitRepository: Repository<ExitEntity>) {}

  public save(model: ExitEntity): Promise<ExitEntity> {
    return this.exitRepository.save(model)
  }

  public findOneById(id: number): Promise<ExitEntity | undefined> {
    return this.exitRepository.findOne(id, { relations: ["source", "destination"] })
  }

  public findAll() {
    return this.exitRepository.find({ relations: [ "destination" ]})
  }
}

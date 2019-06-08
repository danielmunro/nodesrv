import { Repository } from "typeorm"
import { Mob } from "../model/mob"
import MobRepository from "./mob"

export default class MobRepositoryImpl implements MobRepository {
  constructor(private readonly mobRepository: Repository<Mob>) {}

  public async findAll(): Promise<Mob[]> {
    return this.mobRepository.find()
  }

  public async findOne(uuid: string): Promise<Mob | undefined> {
    return this.mobRepository.findOne({ uuid })
  }

  public async save(mob: Mob | Mob[]): Promise<Mob | Mob[]> {
    return this.mobRepository.save(mob)
  }

  public async findOneByName(name: string): Promise<Mob | undefined> {
    return this.mobRepository.findOne({ name })
  }
}

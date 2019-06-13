import { Repository } from "typeorm"
import { MobEntity } from "../entity/mobEntity"
import MobRepository from "./mob"

export default class MobRepositoryImpl implements MobRepository {
  constructor(private readonly mobRepository: Repository<MobEntity>) {}

  public async findAll(): Promise<MobEntity[]> {
    return this.mobRepository.find()
  }

  public async findOne(uuid: string): Promise<MobEntity | undefined> {
    return this.mobRepository.findOne({ uuid })
  }

  public async save(mob: MobEntity | MobEntity[]): Promise<MobEntity | MobEntity[]> {
    return this.mobRepository.save(mob)
  }

  public async findOneByName(name: string): Promise<MobEntity | undefined> {
    return this.mobRepository.findOne({ name })
  }
}

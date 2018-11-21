import { Repository } from "typeorm"
import Container from "../model/container"
import ContainerRepository from "./container"

export default class ContainerRepositoryImpl implements ContainerRepository {
  constructor(private readonly containerRepository: Repository<Container>) {}

  public findOneById(id): Promise<Container> {
    return this.containerRepository.findOneById(id)
  }
}

import { Repository } from "typeorm"
import ContainerRepository from "./container"
import Container from "../model/container"

export default class ContainerRepositoryImpl implements ContainerRepository {
  constructor(private readonly containerRepository: Repository<Container>) {}

  public findOneById(id): Promise<Container> {
    return this.containerRepository.findOneById(id)
  }
}

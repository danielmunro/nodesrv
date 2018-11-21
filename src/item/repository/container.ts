import { getConnection } from "../../db/connection"
import Container from "../model/container"
import ContainerRepositoryImpl from "./containerRepositoryImpl"

export default interface ContainerRepository {
  findOneById(id): Promise<Container>
}

export async function getContainerRepository(): Promise<ContainerRepository> {
  const connection = await getConnection()
  return new ContainerRepositoryImpl(connection.getRepository(Container))
}

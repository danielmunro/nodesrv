import {Container} from "inversify"
import App from "../app"
import actions from "../containerModule/actions"
import constants from "../containerModule/constants"
import eventConsumers from "../containerModule/eventConsumers"
import observers from "../containerModule/observers"
import repositories from "../containerModule/repositories"
import services from "../containerModule/services"
import tables from "../containerModule/tables"

export default async function createAppContainer(startRoomId = 3001, port: number = 5151): Promise<App> {
  const container = new Container()
  container.load(services, actions, eventConsumers, observers)
  await container.loadAsync(tables, repositories, constants(startRoomId, port))
  return new App(container)
}

import {Container} from "inversify"
import App from "../app"
import {Timings} from "../constants"
import actions from "../containerModule/actions"
import constants from "../containerModule/constants"
import eventConsumers from "../containerModule/eventConsumers"
import observers from "../containerModule/observers"
import repositories from "../containerModule/repositories"
import services from "../containerModule/services"
import tables from "../containerModule/tables"
import {Environment} from "../enum/environment"

export default async function createAppContainer(
  stripeApiKey: string,
  stripePlanId: string,
  environment: Environment,
  startRoomId = 3001,
  port: number = 5151): Promise<App> {
  console.time(Timings.container)
  const container = new Container()
  container.load(services, actions, eventConsumers, observers)
  await container.loadAsync(tables, repositories, constants(stripeApiKey, stripePlanId, environment, startRoomId, port))
  console.timeEnd(Timings.container)
  return new App(container)
}

import {Container} from "inversify"
import EventConsumer from "../../event/interface/eventConsumer"
import EventService from "../../event/service/eventService"
import {Types} from "../../support/types"
import App from "../app"
import {Timings} from "../constants"
import actions from "../containerModule/actions"
import constants from "../containerModule/constants"
import eventConsumerList from "../containerModule/eventConsumer/eventConsumerList"
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
  const container = new Container({ skipBaseClassChecks: true })
  container.load(services, actions, observers)
  eventConsumerList.forEach(eventConsumer =>
    container.bind<EventConsumer>(Types.EventConsumerTable).to(eventConsumer))
  await container.loadAsync(tables, repositories, constants(stripeApiKey, stripePlanId, environment, startRoomId, port))
  const eventService = container.get<EventService>(Types.EventService)
  const eventConsumers = container.getAll<EventConsumer>(Types.EventConsumerTable)
  eventConsumers.forEach(eventConsumer => eventService.addConsumer(eventConsumer))
  console.timeEnd(Timings.container)
  return new App(container)
}

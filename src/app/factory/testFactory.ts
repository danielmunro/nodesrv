import {AsyncContainerModule, Container} from "inversify"
import EventConsumer from "../../event/interface/eventConsumer"
import EventService from "../../event/service/eventService"
import {RoomEntity} from "../../room/entity/roomEntity"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"
import actions from "../containerModule/actions"
import eventConsumerList from "../containerModule/eventConsumer/eventConsumerList"
import observers from "../containerModule/observers"
import services from "../containerModule/services"
import testConstants from "../containerModule/testConstants"
import testRepositories from "../containerModule/testRepositories"
import testServices from "../containerModule/testServices"
import testTables from "../containerModule/testTables"

type AfterLoad = (app: Container) => Promise<AsyncContainerModule>

export async function createTestAppContainer(afterLoad?: AfterLoad): Promise<Container> {
  const app = new Container()
  app.load(services, testServices, actions, observers, testRepositories)
  await app.loadAsync(testTables, testConstants)
  if (afterLoad) {
    await app.loadAsync(await afterLoad(app))
  }
  eventConsumerList.forEach(eventConsumer =>
    app.bind<EventConsumer>(Types.EventConsumerTable).to(eventConsumer))
  app.get<RoomTable>(Types.RoomTable).add(app.get<RoomEntity>(Types.StartRoom))
  const eventService = app.get<EventService>(Types.EventService)
  const eventConsumers = app.getAll<EventConsumer>(Types.EventConsumerTable)
  eventConsumers.forEach(eventConsumer => eventService.addConsumer(eventConsumer))
  return app
}

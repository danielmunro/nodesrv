import {Container} from "inversify"
import EventConsumer from "../event/eventConsumer"
import EventService from "../event/eventService"
import {Room} from "../room/model/room"
import RoomTable from "../room/roomTable"
import {Types} from "../support/types"
import actions from "./containerModule/actions"
import eventConsumers from "./containerModule/eventConsumers"
import observers from "./containerModule/observers"
import services from "./containerModule/services"
import testConstants from "./containerModule/testConstants"
import testRepositories from "./containerModule/testRepositories"
import testServices from "./containerModule/testServices"
import testTables from "./containerModule/testTables"

export async function createTestAppContainer(): Promise<Container> {
  const app = new Container()
  app.load(services, testServices, actions, eventConsumers, observers, testRepositories)
  await app.loadAsync(testTables, testConstants)
  const eventService = app.get<EventService>(Types.EventService)
  const eventConsumerTable = app.get<EventConsumer[]>(Types.EventConsumerTable)
  eventConsumerTable.forEach(eventConsumer => eventService.addConsumer(eventConsumer))
  app.get<RoomTable>(Types.RoomTable).add(app.get<Room>(Types.StartRoom))
  return app
}

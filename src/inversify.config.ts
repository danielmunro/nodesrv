import { Container } from "inversify"
import "reflect-metadata"
import actions from "./app/containerModule/actions"
import constants from "./app/containerModule/constants"
import eventConsumers from "./app/containerModule/eventConsumers"
import observers from "./app/containerModule/observers"
import repositories from "./app/containerModule/repositories"
import services from "./app/containerModule/services"
import tables from "./app/containerModule/tables"
import testConstants from "./app/containerModule/testConstants"
import testRepositories from "./app/containerModule/testRepositories"
import testServices from "./app/containerModule/testServices"
import testTables from "./app/containerModule/testTables"
import EventConsumer from "./event/eventConsumer"
import EventService from "./event/eventService"
import {Room} from "./room/model/room"
import RoomTable from "./room/roomTable"
import {Types} from "./support/types"

export default async function createAppContainer(startRoomId = 3001, port: number = 5151): Promise<Container> {
  const app = new Container()
  app.load(services, actions, eventConsumers, observers)
  await app.loadAsync(tables, repositories, constants(startRoomId, port))
  return app
}

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

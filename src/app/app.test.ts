import EventService from "../event/service/eventService"
import ResetService from "../gameService/resetService"
import KafkaService from "../kafka/kafkaService"
import SpecializationService from "../mob/specialization/service/specializationService"
import {GameServerService} from "../server/service/gameServerService"
import App from "./app"
import {createTestAppContainer} from "./factory/testFactory"
import Observers from "./observers"

let app: App

beforeEach(async () => {
  app = new App(await createTestAppContainer())
})

describe("app", () => {
  it("can get a specialization service", () => {
    // when
    const specializationService = app.getSpecializationService()

    // then
    expect(specializationService).toBeInstanceOf(SpecializationService)
  })

  it("can get a kafka service", () => {
    // when
    const kafkaService = app.getKafkaService()

    // then
    expect(kafkaService).toBeInstanceOf(KafkaService)
  })

  it("can get a reset service", () => {
    // when
    const resetService = app.getResetService()

    // then
    expect(resetService).toBeInstanceOf(ResetService)
  })

  it("can get a game server service", () => {
    // when
    const gameServer = app.getGameServer()

    // then
    expect(gameServer).toBeInstanceOf(GameServerService)
  })

  it("can get an event consumer table", () => {
    // when
    const eventConsumerTable = app.getEventConsumerTable()

    // then
    expect(eventConsumerTable).toBeDefined()
  })

  it("can get observers", () => {
    // when
    const observers = app.getObservers()

    // then
    expect(observers).toBeInstanceOf(Observers)
  })

  it("can get an event service", () => {
    // when
    const eventService = app.getEventService()

    // then
    expect(eventService).toBeInstanceOf(EventService)
  })
})

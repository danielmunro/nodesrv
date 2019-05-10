import {Container} from "inversify"
import EventConsumer from "../event/eventConsumer"
import EventService from "../event/eventService"
import ResetService from "../gameService/resetService"
import SpecializationService from "../mob/specialization/specializationService"
import {GameServer} from "../server/server"
import {Types} from "../support/types"
import Observers from "./observers"

export default class App {
  constructor(private readonly container: Container) {}

  public getSpecializationService(): SpecializationService {
    return this.container.get<SpecializationService>(Types.SpecializationService)
  }

  public getEventService(): EventService {
    return this.container.get<EventService>(Types.EventService)
  }

  public getResetService(): ResetService {
    return this.container.get<ResetService>(Types.ResetService)
  }

  public getGameServer(): GameServer {
    return this.container.get<GameServer>(Types.GameServer)
  }

  public getEventConsumerTable(): EventConsumer[] {
    return this.container.get<EventConsumer[]>(Types.EventConsumerTable)
  }

  public getObservers(): Observers {
    return new Observers(this.container)
  }
}

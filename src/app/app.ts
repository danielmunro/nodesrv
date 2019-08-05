import {Container} from "inversify"
import EventConsumer from "../event/interface/eventConsumer"
import EventService from "../event/service/eventService"
import ResetService from "../gameService/resetService"
import KafkaService from "../kafka/kafkaService"
import SpecializationService from "../mob/specialization/service/specializationService"
import {GameServerService} from "../server/service/gameServerService"
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

  public getGameServer(): GameServerService {
    return this.container.get<GameServerService>(Types.GameServer)
  }

  public getEventConsumerTable(): EventConsumer[] {
    return this.container.get<EventConsumer[]>(Types.EventConsumerTable)
  }

  public getObservers(): Observers {
    return new Observers(this.container)
  }

  public getKafkaService(): KafkaService {
    return this.container.get<KafkaService>(Types.KafkaService)
  }

  public getContainer(): Container {
    return this.container
  }
}

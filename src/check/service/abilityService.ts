import {inject, injectable} from "inversify"
import Event from "../../event/interface/event"
import EventService from "../../event/service/eventService"
import Request from "../../request/request"
import {Types} from "../../support/types"
import CheckBuilderFactory from "../factory/checkBuilderFactory"

@injectable()
export default class AbilityService {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {}

  public createCheckTemplate(request: Request) {
    return this.checkBuilderFactory.createCheckTemplate(request)
  }

  public publishEvent(event: Event) {
    return this.eventService.publish(event)
  }
}

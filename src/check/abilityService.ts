import EventService from "../event/service/eventService"
import MobEvent from "../mob/event/mobEvent"
import Request from "../request/request"
import CheckBuilderFactory from "./checkBuilderFactory"

export default class AbilityService {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {}

  public createCheckTemplate(request: Request) {
    return this.checkBuilderFactory.createCheckTemplate(request)
  }

  public publishEvent(event: MobEvent) {
    return this.eventService.publish(event)
  }
}

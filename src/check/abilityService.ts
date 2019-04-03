import Event from "../event/event"
import EventService from "../event/eventService"
import {Request} from "../request/request"
import CheckBuilderFactory from "./checkBuilderFactory"

export default class AbilityService {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {}

  public createCheckTemplate(request: Request) {
    return this.checkBuilderFactory.createCheckTemplate(request)
  }

  public publishEvent(event: Event) {
    return this.eventService.publish(event)
  }
}

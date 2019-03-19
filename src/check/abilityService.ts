import Event from "../event/event"
import EventService from "../event/eventService"
import {Disposition} from "../mob/enum/disposition"
import {Request} from "../request/request"
import CheckBuilderFactory from "./checkBuilderFactory"

export default class AbilityService {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {}

    public createCheckBuilder(request: Request, disposition: Disposition = Disposition.Any) {
      return this.checkBuilderFactory.createCheckBuilder(request, disposition)
    }

  public createCheckTemplate(request: Request) {
    return this.checkBuilderFactory.createCheckTemplate(request)
  }

    public publishEvent(event: Event) {
      return this.eventService.publish(event)
    }
}

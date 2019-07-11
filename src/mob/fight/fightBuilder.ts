import {inject, injectable} from "inversify"
import EventService from "../../event/service/eventService"
import {Types} from "../../support/types"
import {MobEntity} from "../entity/mobEntity"
import LocationService from "../service/locationService"
import {Fight} from "./fight"

@injectable()
export default class FightBuilder {
  constructor(
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {}

  public create(aggressor: MobEntity, defender: MobEntity): Fight {
    return new Fight(
      this.eventService,
      aggressor,
      defender,
      this.locationService.getLocationForMob(aggressor).room)
  }
}

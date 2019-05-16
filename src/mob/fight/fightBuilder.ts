import {inject, injectable} from "inversify"
import EventService from "../../event/eventService"
import {Types} from "../../support/types"
import {Mob} from "../model/mob"
import LocationService from "../service/locationService"
import {Fight} from "./fight"

@injectable()
export default class FightBuilder {
  constructor(
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {}

  public create(aggressor: Mob, defender: Mob): Fight {
    return new Fight(
      this.eventService,
      aggressor,
      defender,
      this.locationService.getLocationForMob(aggressor).room)
  }
}

import EventService from "../../event/eventService"
import LocationService from "../locationService"
import {Mob} from "../model/mob"
import {Fight} from "./fight"

export default class FightBuilder {
  constructor(
    private readonly eventService: EventService,
    private readonly locationService: LocationService) {}

  public create(aggressor: Mob, defender: Mob): Fight {
    return new Fight(
      this.eventService,
      aggressor,
      defender,
      this.locationService.getLocationForMob(aggressor).room)
  }
}

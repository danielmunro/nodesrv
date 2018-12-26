import LocationService from "../mob/locationService"
import { Mob } from "../mob/model/mob"
import { Exit } from "./model/exit"

export default class ExitTable {
  constructor(
    private readonly locationService: LocationService,
    private readonly exits: Exit[] = []) {}

  public exitsForMob(mob: Mob): Exit[] {
    const location = this.locationService.getLocationForMob(mob)
    return this.exits.filter(exit => exit.source.id === location.room.id)
  }
}

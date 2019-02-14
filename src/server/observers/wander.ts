import LocationService from "../../mob/locationService"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import { Observer } from "./observer"

export class Wander implements Observer {
  constructor(
    private readonly mobs: Mob[],
    private readonly locationService: LocationService) {}

  public async notify(): Promise<any> {
    return
    for (const mob of this.mobs) {
      const location = this.locationService.getLocationForMob(mob)
      const destination = pickOne(location.room.exits).destination
      console.log("destination room", destination.uuid)
      this.locationService.updateMobLocation(mob, destination)
    }
  }
}

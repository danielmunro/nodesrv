import LocationService from "../../mob/locationService"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import { Observer } from "./observer"

export class Wander implements Observer {
  constructor(
    private readonly mobs: Mob[],
    private readonly locationService: LocationService) {}

  public async notify(): Promise<any> {
    for (const mob of this.mobs) {
      const location = this.locationService.getLocationForMob(mob)
      if (!location) {
        console.log(`location not found for mob ${mob.name} :: ${mob.uuid}`)
        continue
      }
      const destination = pickOne(location.room.exits).destination
      await this.locationService.updateMobLocation(mob, destination)
    }
  }
}

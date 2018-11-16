import { Client } from "../../client/client"
import LocationService from "../../mob/locationService"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import { Observer } from "./observer"

export class Wander implements Observer {
  constructor(
    private readonly mobs: Mob[],
    private readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<any> {
    await Promise.all(this.mobs.map(async mob => {
      const location = this.locationService.getLocationForMob(mob)
      this.locationService.updateMobLocation(mob, pickOne(location.room.exits).destination)
    }))
  }
}

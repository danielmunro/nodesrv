import MobLocation from "./model/mobLocation"
import { Mob } from "./model/mob"

export default class LocationService {
  constructor(private mobLocations: MobLocation[]) {}

  public getLocationForMob(mob: Mob): MobLocation {
    return this.mobLocations.find(mobLocation => mobLocation.mob === mob)
  }

  public removeMob(mob: Mob) {
    this.mobLocations = this.mobLocations.filter(mobLocation => mobLocation.mob !== mob)
  }
}

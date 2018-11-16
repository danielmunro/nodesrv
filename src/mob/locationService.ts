import { Room } from "../room/model/room"
import { Mob } from "./model/mob"
import MobLocation from "./model/mobLocation"

export default class LocationService {
  constructor(private mobLocations: MobLocation[]) {}

  public updateMobLocation(mob: Mob, room: Room): void {
    this.mobLocations.some(mobLocation => {
      if (mobLocation.mob === mob) {
        mobLocation.room = room
        return true
      }
    })
  }

  public getLocationForMob(mob: Mob): MobLocation {
    return this.mobLocations.find(mobLocation => mobLocation.mob === mob)
  }

  public removeMob(mob: Mob): void {
    this.mobLocations = this.mobLocations.filter(mobLocation => mobLocation.mob !== mob)
  }
}

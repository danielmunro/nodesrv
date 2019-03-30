import LocationService from "../../mob/locationService"
import { Mob } from "../../mob/model/mob"
import { pickOne } from "../../random/helpers"
import {asyncForEach} from "../../support/functional/collection"
import Maybe from "../../support/functional/maybe"
import { Observer } from "./observer"

export class Wander implements Observer {
  constructor(
    private readonly mobs: Mob[],
    private readonly locationService: LocationService) {}

  public async notify(): Promise<void> {
    await asyncForEach(this.mobs, async mob =>
      new Maybe(this.locationService.getLocationForMob(mob))
        .do(location => this.locationService.updateMobLocation(
            mob, pickOne(location.room.exits).destination))
        .or(() => console.log(`location not found for mob ${mob.name} :: ${mob.uuid}`))
        .get())
  }
}

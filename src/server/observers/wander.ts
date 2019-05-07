import {inject, injectable} from "inversify"
import LocationService from "../../mob/locationService"
import MobTable from "../../mob/mobTable"
import { Mob } from "../../mob/model/mob"
import {asyncForEach} from "../../support/functional/collection"
import Maybe from "../../support/functional/maybe"
import { pickOne } from "../../support/random/helpers"
import {Types} from "../../support/types"
import { Observer } from "./observer"

@injectable()
export class Wander implements Observer {
  private readonly mobs: Mob[]

  constructor(
    @inject(Types.MobTable) mobTable: MobTable,
    @inject(Types.LocationService) private readonly locationService: LocationService) {
    this.mobs = mobTable.getWanderingMobs()
  }

  public async notify(): Promise<void> {
    await asyncForEach(this.mobs, async mob =>
      new Maybe(this.locationService.getLocationForMob(mob).room)
        .do(async room => {
          const exit = pickOne(room.exits)
          if (!exit) {
            return
          }
          await this.locationService.updateMobLocation(mob, exit.destination)
        })
        .or(() => console.log(`location not found for mob ${mob.name} :: ${mob.uuid}`))
        .get())
  }
}

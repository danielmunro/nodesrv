import {inject, injectable} from "inversify"
import { MobEntity } from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import MobTable from "../../mob/table/mobTable"
import {asyncForEach} from "../../support/functional/collection"
import { pickOne } from "../../support/random/helpers"
import {Types} from "../../support/types"
import { Observer } from "./observer"

@injectable()
export class Wander implements Observer {
  constructor(
    @inject(Types.MobTable) private readonly mobTable: MobTable,
    @inject(Types.LocationService) private readonly locationService: LocationService) {
  }

  public async notify(): Promise<void> {
    await asyncForEach(this.mobTable.getWanderingMobs(), mob => this.makeMobWander(mob))
  }

  private async makeMobWander(mob: MobEntity) {
    const exits = this.locationService.getLocationForMob(mob).room.exits
    if (exits.length > 0) {
      await this.locationService.updateMobLocation(mob, pickOne(exits).destination)
    }
  }
}

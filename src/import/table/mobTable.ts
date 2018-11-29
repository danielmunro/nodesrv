import { Mob } from "../../mob/model/mob"

export default class MobTable {
  private readonly mobsByImportId = {}

  constructor(mobs: Mob[]) {
    for (const mob of mobs) {
      this.mobsByImportId[mob.importId] = mob
    }
  }

  public getByImportId(id): Mob {
    return this.mobsByImportId[id]
  }
}

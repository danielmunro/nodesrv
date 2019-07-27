import { MobEntity } from "../../mob/entity/mobEntity"

export default class MobTable {
  private readonly mobsByImportId = {}

  constructor(mobs: MobEntity[]) {
    for (const mob of mobs) {
      this.mobsByImportId[mob.canonicalId] = mob
    }
  }

  public getByImportId(id): MobEntity {
    return this.mobsByImportId[id]
  }
}

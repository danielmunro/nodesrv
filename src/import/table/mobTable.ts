import { MobEntity } from "../../mob/entity/mobEntity"

export default class MobTable {
  private readonly mobsByImportId = {}

  constructor(mobs: MobEntity[]) {
    for (const mob of mobs) {
      // @ts-ignore
      this.mobsByImportId[mob.canonicalId] = mob
    }
  }

  public getByImportId(id: any): MobEntity {
    // @ts-ignore
    return this.mobsByImportId[id]
  }
}

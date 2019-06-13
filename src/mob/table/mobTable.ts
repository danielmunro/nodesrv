import { MobEntity } from "../entity/mobEntity"

export default class MobTable {
  constructor(private mobs: MobEntity[] = []) {}

  public getWanderingMobs(): MobEntity[] {
    return this.mobs.filter((mob: MobEntity) => mob.traits.wanders)
  }

  public find(criteria: (mob: MobEntity) => boolean): MobEntity | undefined {
    for (const mob of this.mobs) {
      if (criteria(mob)) {
        return mob
      }
    }
    return undefined
  }

  public apply(fn: () => {}) {
    return this.mobs.forEach(fn)
  }

  public add(mob: MobEntity) {
    this.mobs.push(mob)
  }

  public getMobs(): MobEntity[] {
    return this.mobs
  }

  public pruneDeadMobs() {
    const aliveMobs = this.mobs.filter(m => !m.isDead())
    const deadMobs = this.mobs.filter(m => m.isDead())

    this.mobs = aliveMobs

    return deadMobs
  }
}

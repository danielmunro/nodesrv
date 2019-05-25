import { Mob } from "../model/mob"

export default class MobTable {
  constructor(private mobs: Mob[] = []) {}

  public getWanderingMobs(): Mob[] {
    return this.mobs.filter((mob: Mob) => mob.traits.wanders)
  }

  public find(criteria: (mob: Mob) => boolean): Mob | undefined {
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

  public add(mob: Mob) {
    this.mobs.push(mob)
  }

  public getMobs(): Mob[] {
    return this.mobs
  }

  public pruneDeadMobs() {
    const aliveMobs = this.mobs.filter(m => !m.isDead())
    const deadMobs = this.mobs.filter(m => m.isDead())

    this.mobs = aliveMobs

    return deadMobs
  }
}

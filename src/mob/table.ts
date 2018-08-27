import { Mob } from "./model/mob"

export default class Table {
  constructor(private mobs: Mob[] = []) {}

  public getWanderingMobs(): Mob[] {
    return this.mobs.filter((mob: Mob) => mob.wanders)
  }

  public find(criteria): Mob {
    return this.mobs.find(criteria)
  }

  public apply(fn) {
    return this.mobs.forEach(fn)
  }

  public add(mob: Mob) {
    this.mobs.push(mob)
  }

  public getMobs(): Mob[] {
    return this.mobs
  }
}

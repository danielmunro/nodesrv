import { Mob } from "./model/mob"
import { getMobRepository } from "./repository/mob"

export default class Table {
  public static new(mobs: Mob[]) {
    const mobsById = {}
    mobs.forEach((mob) => mobsById[mob.uuid] = mob)
    return new Table(mobsById)
  }

  constructor(private readonly mobs: object) {}

  public getWanderingMobs(): Mob[] {
    return Object.values(this.mobs).filter((mob: Mob) => mob.wanders)
  }

  public find(criteria) {
    return Object.values(this.mobs).find(criteria)
  }

  public apply(fn) {
    return Object.values(this.mobs).forEach(fn)
  }
}

let mobsById = {}
let mobs = []

export function reset() {
  mobsById = {}
  mobs = []
}

export function getMob(id: number): Mob {
  return mobsById[id]
}

export function getMobs(): Mob[] {
  return mobs
}

export function filterMobs(mobCollection: Mob[], filterFn): Mob[] {
  return mobCollection.map((mob: Mob) => mobsById[mob.id]).filter(filterFn)
}

export async function getTable() {
  const mobRepository = await getMobRepository()
  const models = await mobRepository.findAll()
  console.debug(`mob table initialized with ${models.length} mobs`)
  return Table.new(models)
}

export function addMob(mob: Mob): void {
  mobsById[mob.id] = mob
  mobs.push(mob)
}

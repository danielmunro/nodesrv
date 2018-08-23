import { Mob } from "./model/mob"
import { getMobRepository } from "./repository/mob"

export default class Table {
  public static new(mobs: Mob[]) {
    return new Table(mobs)
  }

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

export async function newTable() {
  const mobRepository = await getMobRepository()
  const models = await mobRepository.findAll()
  console.debug(`mob table initialized with ${models.length} mobs`)
  return Table.new(models)
}

let table = new Table()

export function reset() {
  table = new Table()
}

export function getMob(uuid: string): Mob {
  return table.find((mob) => mob.uuid === uuid)
}

export function getMobs(): Mob[] {
  return table.getMobs()
}

export function addMob(mob: Mob): void {
  table.add(mob)
}

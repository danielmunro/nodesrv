import { Mob } from "./model/mob"
import { getMobRepository } from "./repository/mob"

let mobsById = {}
let mobs = []
let initialized = false

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

export async function initialize() {
  if (initialized) {
    throw new Error()
  }
  initialized = true
  const mobRepository = await getMobRepository()
  let models = await mobRepository.find({ relations: ["room"] })
  models = models.filter((model) => model.isPlayer === false)
  models.forEach((model) => {
    mobsById[model.id] = model
    mobs.push(model)
  })
  console.debug(`mob table initialized with ${models.length} mobs`)
}

export function addMob(mob: Mob): void {
  mobsById[mob.id] = mob
  mobs.push(mob)
}

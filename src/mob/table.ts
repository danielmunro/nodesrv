import { Mob } from "./model/mob"
import { getMobRepository } from "./repository/mob"

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

export async function initialize() {
  reset()
  const mobRepository = await getMobRepository()
  const models = await mobRepository.find({ relations: ["room", "playerMob"] })
  const tmpMobsById = {}
  const tmpAllMobs = []
  models.forEach((model) => {
    tmpMobsById[model.id] = model
    tmpAllMobs.push(model)
  })
  mobsById = tmpMobsById
  mobs = tmpAllMobs
  console.debug(`mob table initialized with ${models.length} mobs`)
}

export function addMob(mob: Mob): void {
  mobsById[mob.id] = mob
  mobs.push(mob)
}

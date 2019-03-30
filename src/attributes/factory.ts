import AttributeBuilder from "./attributeBuilder"
import Attributes from "./model/attributes"
import Hitroll from "./model/hitroll"
import Stats from "./model/stats"
import Vitals from "./model/vitals"

export function newStartingVitals(): Vitals {
  const vitals = new Vitals()
  vitals.hp = 20
  vitals.mana = 100
  vitals.mv = 100

  return vitals
}

export function newVitals(hp: number, mana: number, mv: number): Vitals {
  const vitals = new Vitals()
  vitals.hp = hp
  vitals.mana = mana
  vitals.mv = mv

  return vitals
}

export function newStats(str: number, int: number, wis: number, dex: number, con: number, sta: number): Stats {
  const stats = new Stats()
  stats.str = str
  stats.int = int
  stats.wis = wis
  stats.dex = dex
  stats.con = con
  stats.sta = sta

  return stats
}

export function newStartingStats(): Stats {
  return newStats(15, 15, 15, 15, 15, 15)
}

export function newHitroll(hit: number, dam: number): Hitroll {
  const hitroll = new Hitroll()
  hitroll.hit = hit
  hitroll.dam = dam

  return hitroll
}

export function newStartingAttributes(vitals: Vitals, level: number = 1): Attributes {
  return new AttributeBuilder()
    .setVitals(vitals)
    .setStats(newStartingStats())
    .setHitRoll(newHitroll(1 + Math.floor(level / 3), 1 + Math.ceil(level / 2)))
    .build()
}

export function newEmptyAttributes(): Attributes {
  return new AttributeBuilder()
    .setVitals(newVitals(0, 0, 0))
    .setStats(newStats(0, 0, 0, 0, 0, 0))
    .setHitRoll(newHitroll(0, 0))
    .build()
}

import roll from "../random/dice"
import Attributes from "./model/attributes"
import Hitroll from "./model/hitroll"
import Stats from "./model/stats"
import Vitals from "./model/vitals"

export function newStartingVitals(level: number = 1): Vitals {
  const vitals = new Vitals()
  vitals.hp = 20 + roll(level / 2, 20)
  vitals.mana = 100 + roll(level, 20)
  vitals.mv = 100 + roll(level, 20)

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
  return newAttributes(
    vitals,
    newStartingStats(),
    newHitroll(1 + Math.floor(level / 3), 1 + Math.ceil(level / 2)))
}

export function newAttributes(vitals: Vitals, stats: Stats, hitroll: Hitroll): Attributes {
  const attributes = new Attributes()
  attributes.vitals = vitals
  attributes.stats = stats
  attributes.hitroll = hitroll

  return attributes
}

export function newAttributesWithStats(stats: Stats): Attributes {
  return newAttributes(
    newVitals(0, 0, 0),
    stats,
    newHitroll(0, 0),
  )
}

export function newAttributesWithHitrollStats(hitroll: Hitroll, stats: Stats): Attributes {
  return newAttributes(
    newVitals(0, 0, 0),
    stats,
    hitroll,
  )
}

export function newAttributesWithHitroll(hitroll: Hitroll) {
  return newAttributes(
    newVitals(0, 0, 0),
    newStats(0, 0, 0, 0, 0, 0),
    hitroll)
}

export function newEmptyAttributes(): Attributes {
  return newAttributes(
    newVitals(0, 0, 0),
    newStats(0, 0, 0, 0, 0, 0),
    newHitroll(0, 0))
}

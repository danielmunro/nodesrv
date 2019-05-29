import AttributeBuilder from "../builder/attributeBuilder"
import Attributes from "../model/attributes"
import Stats from "../model/stats"

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

export function newStartingAttributes(hp: number, mana: number, mv: number, level: number = 1): Attributes {
  return new AttributeBuilder()
    .setVitals(hp, mana, mv)
    .setStats(newStartingStats())
    .setHitRoll(1 + Math.floor(level / 3), 1 + Math.ceil(level / 2))
    .build()
}

export function newEmptyAttributes(): Attributes {
  return new AttributeBuilder()
    .setVitals(0, 0, 0)
    .setStats(newStats(0, 0, 0, 0, 0, 0))
    .setHitRoll(0, 0)
    .build()
}

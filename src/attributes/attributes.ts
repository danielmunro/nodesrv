import { Modellable } from "./../db/model"
import { HitDam } from "./hitdam"
import { Stats } from "./stats"
import { Vitals } from "./vitals"

export enum Attribute {
  Str,
  Int,
  Wis,
  Dex,
  Con,
  Sta,
}

export class Attributes implements Modellable {
  public static withStats(stats: Stats): Attributes {
    return new Attributes(
      new HitDam(0, 0),
      stats,
      new Vitals(0, 0, 0),
    )
  }

  public static withVitals(vitals: Vitals): Attributes {
    return new Attributes(
      new HitDam(0, 0),
      new Stats(0, 0, 0, 0, 0, 0),
      vitals,
    )
  }

  public static withHitDamStats(hitDam: HitDam, stats: Stats) {
    return new Attributes(
      hitDam,
      stats,
      new Vitals(0, 0, 0),
    )
  }

  public static withNoAttributes() {
    return new Attributes(
      new HitDam(0, 0),
      new Stats(0, 0, 0, 0, 0, 0),
      new Vitals(0, 0, 0),
    )
  }

  public readonly hitDam: HitDam
  public readonly stats: Stats
  public readonly vitals: Vitals

  constructor(hitDam: HitDam, stats: Stats, vitals: Vitals) {
    this.hitDam = hitDam
    this.stats = stats
    if (!vitals) {
      vitals = new Vitals(0, 0, 0)
    }
    this.vitals = vitals
  }

  public combine(withAttributes: Attributes): Attributes {
    return new Attributes(
      new HitDam(
        this.hitDam.hit + withAttributes.hitDam.hit,
        this.hitDam.dam + withAttributes.hitDam.dam,
      ),
      new Stats(
        this.stats.str + withAttributes.stats.str,
        this.stats.int + withAttributes.stats.int,
        this.stats.wis + withAttributes.stats.wis,
        this.stats.dex + withAttributes.stats.dex,
        this.stats.con + withAttributes.stats.con,
        this.stats.sta + withAttributes.stats.sta,
      ),
      new Vitals(
        this.vitals.hp + withAttributes.vitals.hp,
        this.vitals.mana + withAttributes.vitals.mana,
        this.vitals.mv + withAttributes.vitals.mv,
      ),
    )
  }

  public getModel(): object {
    return {
      con: this.stats.con,
      dam: this.hitDam.dam,
      dex: this.stats.dex,
      hit: this.hitDam.hit,
      hp: this.vitals.hp,
      int: this.stats.int,
      mana: this.vitals.mana,
      mv: this.vitals.mv,
      sta: this.stats.sta,
      str: this.stats.str,
      wis: this.stats.wis,
    }
  }

  public hydrate(data) {
    return new Attributes(
      new HitDam(data.hit, data.dam),
      new Stats(data.str, data.int, data.wis, data.dex, data.con, data.sta),
      new Vitals(data.hp, data.mana, data.mv),
    )
  }
}

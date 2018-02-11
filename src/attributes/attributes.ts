import roll from "./../dice"
import { HitDam } from "./hitdam"
import { Stats } from "./stats"
import { Vitals } from "./vitals"

export class Attributes {
  private hitDam: HitDam
  private stats: Stats
  private vitals: Vitals

  constructor(
    hitDam,
    stats,
    vitals,
  ) {
    this.hitDam = hitDam
    this.stats = stats
    this.vitals = vitals
  }

  public getHitRoll(): number {
    return this.hitDam.getHitRoll()
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
}

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
}

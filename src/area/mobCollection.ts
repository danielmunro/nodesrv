import { SectionType } from "./sectionType"
import { Mob } from "../mob/model/mob"
import roll from "../dice/dice"

export default class MobCollection {
  private collection = {}

  public add(sectionType: SectionType, mob: Mob, chanceToPop: number) {
    if (!this.collection[sectionType]) {
      this.collection[sectionType] = []
    }

    this.collection[sectionType].push({ mob, chanceToPop })
  }

  public getRandomBySectionType(sectionType: SectionType) {
    if (!this.collection[sectionType]) {
      return []
    }
    const mobs = this.collection[sectionType]
    const newMobs = []
    mobs.forEach((m) => roll(1, 100) < m.chanceToPop * 100 ? newMobs.push(m.mob.copy()) : null)

    return mobs
  }
}

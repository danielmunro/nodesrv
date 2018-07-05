import roll from "../dice/dice"
import SectionSpec from "./sectionSpec/sectionSpec"
import { SectionType } from "./sectionType"

export default class RoomCollection {
  private collection = {}

  public add(sectionType: SectionType, spec: SectionSpec) {
    if (!this.collection[sectionType]) {
      this.collection[sectionType] = []
    }

    this.collection[sectionType].push(spec)
  }

  public getRandomBySectionType(sectionType: SectionType): SectionSpec {
    const specs = this.collection[sectionType]
    return specs[roll(1, specs.length) - 1]
  }
}

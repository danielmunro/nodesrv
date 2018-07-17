import roll from "../random/dice"
import { Item } from "../item/model/item"
import { SectionType } from "./sectionType"

export default class ItemCollection {
  private collection = {}

  public add(sectionType: SectionType, item: Item, chanceToPop: number) {
    if (!this.collection[sectionType]) {
      this.collection[sectionType] = []
    }

    this.collection[sectionType].push({ item, chanceToPop })
  }

  public getRandomBySectionType(sectionType: SectionType) {
    if (!this.collection[sectionType]) {
      return []
    }
    const items = this.collection[sectionType]
    const newItems = []
    items.forEach((i) => roll(1, 100) < i.chanceToPop * 100 ? newItems.push(i.item.copy()) : null)

    return newItems
  }
}

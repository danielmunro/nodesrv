import { Item } from "../../item/model/item"

export default class ItemTable {
  private readonly itemsByImportId = {}

  constructor(items: Item[]) {
    for (const item of items) {
      this.itemsByImportId[item.canonicalId] = item
    }
  }

  public getByImportId(id): Item {
    return this.itemsByImportId[id]
  }
}

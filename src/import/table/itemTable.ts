import { ItemEntity } from "../../item/entity/itemEntity"

export default class ItemTable {
  private readonly itemsByImportId = {}

  constructor(items: ItemEntity[]) {
    for (const item of items) {
      this.itemsByImportId[item.canonicalId] = item
    }
  }

  public getByImportId(id): ItemEntity {
    return this.itemsByImportId[id]
  }
}

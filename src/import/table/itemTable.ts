import { ItemEntity } from "../../item/entity/itemEntity"

export default class ItemTable {
  private readonly itemsByImportId = {}

  constructor(items: ItemEntity[]) {
    for (const item of items) {
      // @ts-ignore
      this.itemsByImportId[item.canonicalId] = item
    }
  }

  public getByImportId(id: any): ItemEntity {
    // @ts-ignore
    return this.itemsByImportId[id]
  }
}

import ItemTable from "./itemTable"
import { Inventory } from "./model/inventory"
import { Item } from "./model/item"
import ItemReset from "./model/itemReset"

export default class ItemService {
  constructor(
    public readonly itemTable: ItemTable = new ItemTable(),
    private readonly itemTemplateTable: ItemTable = new ItemTable(),
  ) {}

  public async generateNewItemInstance(itemReset: ItemReset): Promise<Item> {
    const item = this.itemTemplateTable.items.find(i => i.id === itemReset.item.id)
    const copy = item.copy()
    copy.canonicalId = itemReset.item.canonicalId
    return copy
  }

  public getByCanonicalId(canonicalId) {
    return this.itemTable.items.filter(item => item.canonicalId === canonicalId)
  }

  public findItem(inventory: Inventory, search: string) {
    return this.itemTable.findItemByInventory(inventory, search)
  }

  public findAllByInventory(inventory: Inventory) {
    return this.itemTable.findByInventory(inventory)
  }

  public add(item: Item) {
    this.itemTable.add(item)
  }

  public remove(item: Item) {
    this.itemTable.remove(item)
  }
}

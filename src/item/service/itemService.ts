import {inject, injectable} from "inversify"
import {cloneDeep} from "lodash"
import "reflect-metadata"
import {Types} from "../../support/types"
import { Inventory } from "../model/inventory"
import { Item } from "../model/item"
import ItemReset from "../model/itemReset"
import ItemTable from "../table/itemTable"

@injectable()
export default class ItemService {
  constructor(
    @inject(Types.ItemTable) private readonly itemTemplateTable: ItemTable = new ItemTable(),
    public readonly itemTable: ItemTable = new ItemTable()) {}

  public async generateNewItemInstance(itemReset: ItemReset): Promise<Item> {
    const item = this.itemTemplateTable.items.find(i => i.id === itemReset.item.id)
    const copy = cloneDeep(item) as Item
    copy.canonicalId = itemReset.item.canonicalId
    return copy
  }

  public getByCanonicalId(canonicalId: string) {
    return this.itemTable.items.filter(item => item.canonicalId === canonicalId)
  }

  public findItem(inventory: Inventory, search: string) {
    return this.itemTable.findItemByInventory(inventory, search)
  }

  public findAllByInventory(inventory: Inventory) {
    return this.itemTable.findByInventory(inventory)
  }

  public add(item: Item, carriedBy: any = null) {
    this.itemTable.add(item)
    if (carriedBy) {
      item.carriedBy = carriedBy
    }
  }

  public remove(item: Item) {
    this.itemTable.remove(item)
  }
}

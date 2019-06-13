import {inject, injectable} from "inversify"
import {cloneDeep} from "lodash"
import "reflect-metadata"
import {Types} from "../../support/types"
import { InventoryEntity } from "../entity/inventoryEntity"
import { ItemEntity } from "../entity/itemEntity"
import ItemResetEntity from "../entity/itemResetEntity"
import ItemTable from "../table/itemTable"

@injectable()
export default class ItemService {
  constructor(
    @inject(Types.ItemTable) private readonly itemTemplateTable: ItemTable = new ItemTable(),
    public readonly itemTable: ItemTable = new ItemTable()) {}

  public async generateNewItemInstance(itemReset: ItemResetEntity): Promise<ItemEntity> {
    const item = this.itemTemplateTable.items.find(i => i.id === itemReset.item.id)
    const copy = cloneDeep(item) as ItemEntity
    copy.canonicalId = itemReset.item.canonicalId
    return copy
  }

  public getByCanonicalId(canonicalId: string) {
    return this.itemTable.items.filter(item => item.canonicalId === canonicalId)
  }

  public findItem(inventory: InventoryEntity, search: string) {
    return this.itemTable.findItemByInventory(inventory, search)
  }

  public findAllByInventory(inventory: InventoryEntity) {
    return this.itemTable.findByInventory(inventory)
  }

  public add(item: ItemEntity, carriedBy: any = null) {
    this.itemTable.add(item)
    if (carriedBy) {
      item.carriedBy = carriedBy
    }
  }

  public remove(item: ItemEntity) {
    this.itemTable.remove(item)
  }
}

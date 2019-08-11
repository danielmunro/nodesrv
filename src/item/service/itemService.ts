import {inject, injectable} from "inversify"
import {cloneDeep} from "lodash"
import "reflect-metadata"
import { v4 } from "uuid"
import {Types} from "../../support/types"
import { InventoryEntity } from "../entity/inventoryEntity"
import { ItemEntity } from "../entity/itemEntity"
import ItemResetEntity from "../entity/itemResetEntity"
import ItemTable from "../table/itemTable"

@injectable()
export default class ItemService {
  public static cloneItem(targetItem: ItemEntity): ItemEntity {
    // @ts-ignore
    targetItem.inventory = undefined
    const item = cloneDeep(targetItem)
    // @ts-ignore
    item.id = undefined
    item.uuid = v4()
    // @ts-ignore
    item.affects.forEach(affect => affect.id = undefined)
    // @ts-ignore
    item.attributes.id = undefined
    if (item.forge) {
      // @ts-ignore
      item.forge.id = undefined
      // @ts-ignore
      item.forge.uuid = undefined
    }
    if (item.drink) {
      // @ts-ignore
      item.drink.id = undefined
      // @ts-ignore
      item.drink.uuid = undefined
    }
    if (item.food) {
      // @ts-ignore
      item.food.id = undefined
      // @ts-ignore
      item.food.uuid = undefined
    }
    return item
  }

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

import ItemReset from "./model/itemReset"
import { Item } from "./model/item"
import ItemRepository from "./repository/item"
import ItemTable from "./itemTable"
import { Inventory } from "./model/inventory"

export default class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly itemTable: ItemTable,
  ) {}

  public async generateNewItemInstance(itemReset: ItemReset): Promise<Item> {
    const item = await this.itemRepository.findOneById(itemReset.item.id)
    return item.copy()
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

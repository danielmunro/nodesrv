import {createItem, newTrash} from "./factory/itemFactory"
import { Inventory } from "./model/inventory"
import { Item } from "./model/item"
import {createInventory} from "./factory/inventoryFactory"

describe("inventory model", () => {
  it("should be able to find an item", () => {
    const inventory = createInventory()
    const item1 = createItem()
    item1.name = "foo"
    const item2 = createItem()
    item2.name = "bar"
    inventory.addItem(item1)
    inventory.addItem(item2)

    expect(inventory.find((item: Item) => item.name === "foo")).toBe(item1)
    expect(inventory.find((item: Item) => item.name === "bar")).toBe(item2)
    expect(inventory.find((item: Item) => item.name === "baz")).toBeUndefined()
  })

  it("should combine items with the same name", () => {
    const itemCreator = () => newTrash("foo", "bar")
    const inventory = createInventory()
    inventory.addItem(itemCreator())
    inventory.addItem(itemCreator())
    inventory.addItem(itemCreator())

    expect(inventory.toString()).toContain("(3) foo")
    expect(inventory.toString("has here")).toContain("(3) foo has here")
  })
})

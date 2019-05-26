import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/itemFactory"
import collectionSearch from "./collectionSearch"

describe("collectionSearch", () => {
  it("should find in an array", () => {
    const collection = ["this", "foo", "bar", "baz"]
    expect(collectionSearch(collection, "ba")).toBe("bar")
    expect(collectionSearch(collection, "1.ba")).toBe("bar")
    expect(collectionSearch(collection, "2.ba")).toBe("baz")
    expect(collectionSearch(collection, "0.ba")).toBeFalsy()
    expect(collectionSearch(collection, "3.ba")).toBeFalsy()
  })

  it("should find the right item in a collection of objects", () => {
    const collection = [
      newItem(ItemType.Equipment, "a hat", "description"),
      newItem(ItemType.Drink, "a bottle of milk", "description"),
      newItem(ItemType.Key, "a key", "description"),
      newItem(ItemType.ItemPart, "a bottle of lead", "description"),
      newItem(ItemType.Drink, "a bottle of apple juice", "description"),
    ]

    expect(collectionSearch(collection, "2.bottle", item => item.itemType === ItemType.Drink).name)
      .toBe("a bottle of apple juice")
  })
})

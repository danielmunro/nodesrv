import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import collectionSearch from "../../support/matcher/collectionSearch"
import { format } from "../../support/string"
import ItemQuantity from "../itemQuantity"
import { Item } from "./item"

interface ItemQuantityMap { [key: string]: ItemQuantity }

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToMany(() => Item, item => item.inventory, { cascade: true })
  public items: Item[]

  public find(search: (value: Item) => boolean): Item | undefined {
    return this.items.find(search)
  }

  public findItemByName(search: string): Item | undefined {
    return collectionSearch(this.items, search)
  }

  public removeItem(item: Item): void {
    this.items = this.items.filter((i) => i !== item)
  }

  public addItem(item: Item, carriedBy?: any): void {
    if (item.inventory) {
      item.inventory.removeItem(item)
    }
    item.inventory = this
    item.carriedBy = carriedBy
    this.items.push(item)
  }

  public getItemFrom(item: Item, fromInventory: Inventory): void {
    fromInventory.removeItem(item)
    this.addItem(item)
  }

  public getItemQuantityMap() {
    const itemsMap: ItemQuantityMap = {}
    this.items.forEach(item => {
      if (!itemsMap[item.canonicalId]) {
        itemsMap[item.canonicalId] = { item, canonicalId: item.canonicalId, quantity: 0 } as ItemQuantity
      }
      itemsMap[item.canonicalId].quantity++
    })
    return itemsMap
  }

  public toString(suffix: string = ""): string {
    const itemsMap = this.getItemQuantityMap()
    return Object.keys(itemsMap).reduce(
      (aggregate, current) => {
        const itemQuantity: ItemQuantity = itemsMap[current]
        return format(
          "{0}\n{1}{2} {3}",
          aggregate,
          itemQuantity.quantity > 1 ? "(" + itemQuantity.quantity + ") " : "",
          itemQuantity.item.name,
          suffix)
      }, "")
  }
}

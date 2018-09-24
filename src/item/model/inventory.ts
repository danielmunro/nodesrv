import {Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { format } from "../../support/string"
import { Item } from "./item"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToMany((type) => Item, (item) => item.inventory, { cascadeInsert: true, cascadeUpdate: true })
    public items: Item[] = []

    public find(search): Item | undefined {
      return this.items.find(search)
    }

    public findItemByName(search: string): Item | undefined {
      return this.items.find((i) => i.matches(search))
    }

    public removeItem(item: Item): void {
      this.items = this.items.filter((i) => i !== item)
    }

    public addItem(item: Item): void {
      if (item.inventory) {
        item.inventory.removeItem(item)
      }
      item.inventory = this
      this.items.push(item)
    }

    public getItemFrom(item: Item, fromInventory: Inventory): void {
      fromInventory.removeItem(item)
      this.addItem(item)
    }

    public getItems(): Item[] {
      return this.items
    }

  public toString(suffix: string = ""): string {
    const itemsMap = {}
    this.items.forEach(i => itemsMap[i.name] ? itemsMap[i.name]++ : itemsMap[i.name] = 1)
    return Object.keys(itemsMap).reduce(
      (aggregate, current) => {
        return format(
          "{0}\n{1}{2} {3}",
          aggregate,
          itemsMap[current] > 1 ? "(" + itemsMap[current] + ") " : "",
          current,
          suffix)
      }, "")
  }
}

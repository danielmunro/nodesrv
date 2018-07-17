import {Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Item } from "./item"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToMany((type) => Item, (item) => item.inventory, { cascadeInsert: true, cascadeUpdate: true, eager: true })
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

  public toString(): string {
    return this.items.reduce(
      (aggregate, current: Item) =>
        aggregate + current.name + "\n",
      "Inventory:")
  }
}

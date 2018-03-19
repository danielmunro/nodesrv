import {Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import { Room } from "../../room/model/room"
import { Equipped } from "./equipped"
import { Item } from "./item"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToMany((type) => Item, (item) => item.inventory)
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
}

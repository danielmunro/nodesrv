import {Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import { Room } from "../../room/model/room"
import { Item } from "./item"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne((type) => Mob, (mob) => mob.inventory)
    public mob: Mob

    @OneToOne((type) => Room, (room) => room.inventory)
    public room: Room

    @OneToMany((type) => Item, (item) => item.inventory)
    private items: Item[] = []

    public findItem(search: string): Item | null {
      return this.items.find((i) => i.matches(search))
    }

    public removeItem(item: Item): void {
      this.items = this.items.filter((i) => i !== item)
    }

    public addItem(item: Item): void {
      this.items.push(item)
    }
}

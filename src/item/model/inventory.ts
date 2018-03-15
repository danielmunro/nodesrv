import {Column, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"
import { Item } from "./item"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToMany((type) => Item, (item) => item.inventory)
    public items: Item[] = []

    @OneToOne((type) => Mob, (mob) => mob.inventory)
    public mob: Mob

    @OneToOne((type) => Room, (room) => room.inventory)
    public room: Room

    public findItem(search: string): Item | null {
      return this.items.find((i) => i.matches(search))
    }
}

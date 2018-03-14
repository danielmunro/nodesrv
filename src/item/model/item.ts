import {Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"
import { Inventory } from "./inventory"

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    public name: string

    @Column("text")
    public description: string

    @ManyToOne((type) => Inventory, (inventory) => inventory.items)
    public inventory: Inventory
}

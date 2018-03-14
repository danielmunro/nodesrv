import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"
import { Item } from "./item"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToMany((type) => Item, (item) => item.inventory)
    public items: Item[] = []
}

import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import { Inventory } from "./inventory"
import { Item } from "./item"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne((type) => Inventory)
    @JoinColumn()
    public inventory: Inventory = new Inventory()
}

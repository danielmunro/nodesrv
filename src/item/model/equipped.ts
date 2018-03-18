import {Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import { Inventory } from "./inventory"
import { Item } from "./item"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne((type) => Inventory, (inventory) => inventory.equipped)
    public inventory: Inventory = new Inventory()

    @OneToOne((type) => Mob, (mob) => mob.equipped)
    public mob: Mob
}

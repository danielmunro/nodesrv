import {Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import { Item } from "./item"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToMany((type) => Item, (item) => item.inventory)
    public items: Item[] = []

    @OneToOne((type) => Mob, (mob) => mob.equipped)
    public mob: Mob
}

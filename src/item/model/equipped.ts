import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Equipment } from "../equipment"
import { Inventory } from "./inventory"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne(type => Inventory, { eager: true, cascadeAll: true })
    @JoinColumn()
    public inventory: Inventory = new Inventory()

    public byPosition(equipment: Equipment) {
        return this.inventory.find(i => i.equipment === equipment)
    }
}

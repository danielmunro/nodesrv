import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "./inventory"
import { Equipment } from "../equipment"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne((type) => Inventory)
    @JoinColumn()
    public inventory: Inventory = new Inventory()

    public byPosition(equipment: Equipment) {
        return this.inventory.find(i => i.equipment === equipment)
    }
}

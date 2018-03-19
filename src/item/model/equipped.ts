import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "./inventory"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne((type) => Inventory)
    @JoinColumn()
    public inventory: Inventory = new Inventory()
}

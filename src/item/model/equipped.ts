import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "./inventory"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne(() => Inventory, { eager: true, cascadeAll: true })
    @JoinColumn()
    public inventory: Inventory = new Inventory()
}

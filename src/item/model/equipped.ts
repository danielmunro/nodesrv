import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "./inventory"
import {createInventory} from "../factory/inventoryFactory"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne(() => Inventory, undefined, { eager: true, cascade: true })
    @JoinColumn()
    public inventory: Inventory = createInventory()
}

import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {createInventory} from "../factory/inventoryFactory"
import { Inventory } from "./inventory"

@Entity()
export class Equipped {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne(() => Inventory, undefined, { eager: true, cascade: true })
    @JoinColumn()
    public inventory: Inventory = createInventory()
}

import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {createInventory} from "../factory/inventoryFactory"
import { InventoryEntity } from "./inventoryEntity"

@Entity()
export class EquippedEntity {
    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne(() => InventoryEntity, undefined, { eager: true, cascade: true })
    @JoinColumn()
    public inventory: InventoryEntity = createInventory()
}

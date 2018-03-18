import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import Attributes from "../../attributes/model/attributes"
import { Equipment } from "../equipment"
import { Inventory } from "./inventory"

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    public name: string

    @Column("text")
    public description: string

    @Column("text")
    public equipment: Equipment

    @ManyToOne((type) => Inventory, (inventory) => inventory.items)
    public inventory: Inventory

    @OneToOne((type) => Attributes, (attributes) => attributes.item)
    public attributes: Attributes

    public matches(subject: string): boolean {
      return this.name.split(" ").find((word) => word.startsWith(subject)) ? true : false
    }
}

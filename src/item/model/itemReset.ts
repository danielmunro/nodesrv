import { Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Inventory } from "./inventory"
import { Item } from "./item"
import { Equipment } from "../equipment"

@Entity()
export default class ItemReset {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @ManyToOne(type => Inventory, inventory => inventory.itemResets)
  public inventory: Inventory

  @OneToOne(type => Item)
  public item: Item

  @Column("integer")
  public itemLimit: number = 0

  @Column("text", { nullable: true })
  public equipmentPosition: Equipment = null
}

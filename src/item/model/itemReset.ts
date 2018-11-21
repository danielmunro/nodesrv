import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Equipment } from "../equipment"
import { Inventory } from "./inventory"
import { Item } from "./item"

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
  @JoinColumn()
  public item: Item

  @Column("integer")
  public itemLimit: number = 0

  @Column("text", { nullable: true })
  public equipmentPosition: Equipment = null
}

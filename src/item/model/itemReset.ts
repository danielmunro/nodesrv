import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Equipment } from "../equipment"
import { Item } from "./item"

@Entity()
export default abstract class ItemReset {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @OneToOne(type => Item, { eager: true })
  @JoinColumn()
  public item: Item

  @Column("text", { nullable: true })
  public equipmentPosition: Equipment = null

  @Column("integer")
  public maxQuantity

  @Column("integer", { nullable: true })
  public maxPerRoom
}

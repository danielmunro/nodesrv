import {Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import { Equipment } from "../enum/equipment"
import { Item } from "./item"

@Entity()
export default abstract class ItemReset {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @ManyToOne(() => Item, { eager: true })
  @JoinColumn()
  public item: Item

  @Column("text", { nullable: true })
  public equipmentPosition: Equipment

  @Column("integer")
  public maxQuantity: number

  @Column("integer", { nullable: true })
  public maxPerRoom: number
}

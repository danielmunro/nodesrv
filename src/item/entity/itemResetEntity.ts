import {Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import { Equipment } from "../enum/equipment"
import { ItemEntity } from "./itemEntity"

@Entity()
export default abstract class ItemResetEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @ManyToOne(() => ItemEntity, { eager: true })
  @JoinColumn()
  public item: ItemEntity

  @Column("text", { nullable: true })
  public equipmentPosition: Equipment

  @Column()
  public maxQuantity: number

  @Column({ nullable: true })
  public maxPerRoom: number
}

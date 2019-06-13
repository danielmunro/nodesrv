import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Liquid } from "../enum/liquid"
import { ItemEntity } from "./itemEntity"

@Entity()
export default class DrinkEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { default: Liquid.Water })
  public liquid: Liquid

  @Column("integer", { nullable: true })
  public capacity: number

  @Column("integer")
  public drinkAmount: number

  @Column("integer")
  public foodAmount: number

  @OneToOne(() => ItemEntity, item => item.food)
  public item: ItemEntity
}

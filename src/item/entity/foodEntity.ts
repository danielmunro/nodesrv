import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { ItemEntity } from "./itemEntity"

@Entity()
export default class FoodEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("integer")
  public foodAmount: number = 1

  @Column("integer")
  public drinkAmount: number = 0

  @OneToOne(() => ItemEntity, item => item.food)
  public item: ItemEntity
}
